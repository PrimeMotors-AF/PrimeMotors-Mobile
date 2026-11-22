import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  parseCreateProposalDto,
  parseUpdateProposalDto,
  parseUpdateProposalStatusDto,
} from "../dtos/proposal.dto";
import { parsePaginationParam } from "../dtos/pagination.dto";
import { ApiError } from "../errors/ApiError";
import prisma from "../config/database";

const getUserId = (req: Request) => req.user?.id;
const getId = (req: Request, param: string) => String(req.params[param] ?? "");
const findProposal = (id: string) =>
  prisma.garage.findUnique({ where: { id } });

function handleProposalCreateError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new ApiError(
      409,
      "CONFLICT",
      "Já existe uma proposta igual em aberto.",
    );
  }
  throw error;
}

export const createProposal = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }

  const { offeredValue, message, carId } = parseCreateProposalDto(req.body);
  const alreadyExists = await prisma.garage.findFirst({
    where: { userId, carId, status: "Pendente" },
  });
  if (alreadyExists) {
    throw new ApiError(
      409,
      "CONFLICT",
      "Já existe uma proposta pendente para este veículo.",
    );
  }

  let proposal;
  try {
    proposal = await prisma.$transaction(async (transaction) => {
      const createdProposal = await transaction.garage.create({
        data: { offeredValue, message, carId, userId, status: "Pendente" },
      });

      await transaction.proposalOutbox.create({
        data: { proposalId: createdProposal.id },
      });

      return createdProposal;
    });
  } catch (error) {
    return handleProposalCreateError(error);
  }

  return res.status(201).json({
    id: proposal.id,
    date_offer: proposal.date_offer,
    offeredValue: proposal.offeredValue,
    message: proposal.message,
    carImageUrl: proposal.carImageUrl,
    status: proposal.status,
    adminArchived: proposal.adminArchived,
    carId: proposal.carId,
    userId: proposal.userId,
  });
};

export const updateProposal = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }

  const id = getId(req, "proposalId");
  const { offeredValue, message } = parseUpdateProposalDto(req.body);
  if (!offeredValue) {
    throw new ApiError(400, "INVALID_REQUEST", "offeredValue inválido.");
  }

  const proposal = await findProposal(id);
  if (!proposal) {
    throw new ApiError(404, "NOT_FOUND", "Proposta não encontrada.");
  }
  if (proposal.userId !== userId) {
    throw new ApiError(403, "FORBIDDEN", "Acesso negado.");
  }

  const updated = await prisma.garage.update({
    where: { id },
    data: { offeredValue, message },
  });
  return res.status(200).json(updated);
};

export const deleteProposal = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }

  const id = getId(req, "proposalId");
  const proposal = await findProposal(id);
  if (!proposal) {
    throw new ApiError(404, "NOT_FOUND", "Proposta não encontrada.");
  }
  if (proposal.userId !== userId) {
    throw new ApiError(403, "FORBIDDEN", "Acesso negado.");
  }

  await prisma.garage.delete({ where: { id } });
  return res.status(200).json({ message: "Excluída com sucesso." });
};

export const getUserProposals = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }
  if (getId(req, "id") !== userId) {
    throw new ApiError(403, "FORBIDDEN", "Acesso negado.");
  }

  const page = parsePaginationParam(req.query.page, 1);
  const limit = parsePaginationParam(req.query.limit, 10);
  const proposals = await prisma.garage.findMany({
    where: { userId },
    include: {
      car: {
        select: {
          name: true,
          images: { select: { url: true }, orderBy: { id: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { date_offer: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return res.status(200).json(
    proposals.map((proposal) => ({
      id: proposal.id,
      offeredValue: proposal.offeredValue,
      status: proposal.status,
      imgUrl: proposal.car?.images[0]?.url ?? null,
      name: proposal.car?.name ?? "Veículo não identificado",
      message: proposal.message,
      date_offer: proposal.date_offer,
    })),
  );
};

export const getAllProposals = async (req: Request, res: Response) => {
  const adminId = req.user?.id;
  if (!adminId) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }

  const proposals = await prisma.garage.findMany({
    where: { userId: { not: adminId }, adminArchived: false },
    include: {
      car: {
        select: {
          name: true,
          images: { select: { url: true }, orderBy: { id: "asc" }, take: 1 },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { date_offer: "desc" },
  });

  return res.status(200).json(
    proposals.map((proposal) => ({
      id: proposal.id,
      offeredValue: Number(proposal.offeredValue),
      status: proposal.status,
      imgUrl: proposal.car?.images[0]?.url ?? null,
      name: proposal.car?.name ?? "Veículo não identificado",
      message: proposal.message,
      date_offer: proposal.date_offer,
      user: proposal.user,
    })),
  );
};

export const updateProposalStatus = async (req: Request, res: Response) => {
  const { status } = parseUpdateProposalStatusDto(req.body);
  const proposal = await prisma.garage.update({
    where: { id: getId(req, "proposalId") },
    data: { status },
  });
  return res.status(200).json(proposal);
};

export const deleteAdminProposal = async (req: Request, res: Response) => {
  const proposalId = getId(req, "proposalId");
  if (!proposalId || proposalId === "undefined") {
    throw new ApiError(
      400,
      "INVALID_PROPOSAL_ID",
      "Identificador da proposta inválido.",
    );
  }

  const result = await prisma.garage.updateMany({
    where: { id: proposalId },
    data: { adminArchived: true },
  });
  if (result.count === 0) {
    throw new ApiError(404, "NOT_FOUND", "Proposta não encontrada.");
  }

  return res.status(200).json({ message: "Proposta excluída com sucesso." });
};
