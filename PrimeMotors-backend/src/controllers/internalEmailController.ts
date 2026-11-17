import { Request, Response } from "express";
import prisma from "../config/database";
import { ApiError } from "../errors/ApiError";

export const getProposalEmailEvent = async (
  req: Request,
  res: Response,
) => {
  const proposal = await prisma.garage.findUnique({
    where: { id: String(req.params.proposalId) },
    select: {
      id: true,
      offeredValue: true,
      message: true,
      status: true,
      date_offer: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      car: {
        select: {
          id: true,
          name: true,
          value: true,
        },
      },
    },
  });

  if (!proposal) {
    throw new ApiError(404, "NOT_FOUND", "Proposta não encontrada.");
  }

  return res.status(200).json({
    event: "proposal.created",
    data: {
      proposal: {
        id: proposal.id,
        offeredValue: proposal.offeredValue.toString(),
        message: proposal.message,
        status: proposal.status,
        createdAt: proposal.date_offer.toISOString(),
      },
      user: proposal.user,
      car: {
        ...proposal.car,
        value: proposal.car.value.toString(),
      },
    },
  });
};
