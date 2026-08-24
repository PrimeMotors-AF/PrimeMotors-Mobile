import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import prisma from "../config/database";

const parsePaginationParam = (
  value: string | string[] | undefined,
  fallback: number,
) => {
  const pageString = Array.isArray(value) ? value[0] : value;
  const parsed = Number(pageString);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const getUser = (req: Request) => req.user?.id;
const getId = (req: Request, param: string) => String(req.params[param]);
const findProposal = (id: string) =>
  prisma.garage.findUnique({ where: { id } });

export const createProposal = async (req: Request, res: Response) => {
  const userId = getUser(req);
  if (!userId) return res.status(401).json({ error: "Não autenticado." });

  const { offeredValue, message, carId } = req.body as {
    offeredValue: number;
    message?: string;
    carId: string;
  };
  if (!carId || offeredValue == null)
    return res
      .status(400)
      .json({ error: "carId e offeredValue obrigatórios." });

  try {
    const alreadyExists = await prisma.garage.findFirst({
      where: { userId, carId, status: "Pendente" },
    });
    if (alreadyExists)
      return res
        .status(409)
        .json({ error: "Já existe uma proposta pendente para este veículo." });

    const proposal = await prisma.garage.create({
      data: { offeredValue, message, carId, userId, status: "Pendente" }, // ✅ sem carImageUrl
    });

    return res.status(201).json(proposal);
  } catch (error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return res
        .status(409)
        .json({ error: "Já existe uma proposta igual em aberto." });
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar proposta." });
  }
};

export const updateProposal = async (req: Request, res: Response) => {
  const userId = getUser(req);
  if (!userId) return res.status(401).json({ error: "Não autenticado." });

  const id = getId(req, "proposalId");
  const { offeredValue, message } = req.body as {
    offeredValue: number;
    message?: string;
  };
  if (!offeredValue || isNaN(Number(offeredValue)))
    return res.status(400).json({ error: "offeredValue inválido." });

  try {
    const proposal = await findProposal(id);
    if (!proposal)
      return res.status(404).json({ error: "Proposta não encontrada." });
    if (proposal.userId !== userId)
      return res.status(403).json({ error: "Acesso negado." });

    const updated = await prisma.garage.update({
      where: { id },
      data: { offeredValue: Number(offeredValue), message },
    });
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar proposta." });
  }
};

export const deleteProposal = async (req: Request, res: Response) => {
  const userId = getUser(req);
  if (!userId) return res.status(401).json({ error: "Não autenticado." });

  const id = getId(req, "proposalId");

  try {
    const proposal = await findProposal(id);
    if (!proposal)
      return res.status(404).json({ error: "Proposta não encontrada." });
    if (proposal.userId !== userId)
      return res.status(403).json({ error: "Acesso negado." });

    await prisma.garage.delete({ where: { id } });
    return res.status(200).json({ message: "Excluída com sucesso." });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao excluir proposta." });
  }
};

export const getUserProposals = async (req: Request, res: Response) => {
  const userId = getUser(req);
  if (!userId) return res.status(401).json({ error: "Não autenticado." });
  if (getId(req, "id") !== userId)
    return res.status(403).json({ error: "Acesso negado." });

  try {
    const page = parsePaginationParam(req.query.page as any, 1);
    const limit = parsePaginationParam(req.query.limit as any, 10);

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
      proposals.map((p: any) => ({
        id: p.id,
        offeredValue: p.offeredValue,
        status: p.status,
        imgUrl: p.car?.images[0]?.url ?? null,
        name: p.car?.name ?? "Veículo não identificado",
        message: p.message,
        date_offer: p.date_offer,
      })),
    );
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar propostas." });
  }
};
