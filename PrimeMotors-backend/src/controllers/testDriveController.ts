import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  parseCreateTestDriveDto,
  parseUpdateTestDriveDto,
} from "../dtos/testDrive.dto";
import { ApiError } from "../errors/ApiError";
import prisma from "../config/database";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new ApiError(401, "UNAUTHORIZED", "Não autenticado.");
  }
  return req.user.id;
}

function handleTestDriveError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new ApiError(409, "CONFLICT", "Este agendamento já existe.");
  }
  throw error;
}

export const createTestDriveController = async (
  req: Request,
  res: Response,
) => {
  const userId = getAuthenticatedUserId(req);
  const { carId, scheduledAt, message } = parseCreateTestDriveDto(req.body);
  const dateFormatted = new Date(scheduledAt);

  const existing = await prisma.testDrive.findFirst({
    where: { carId, userId, scheduledAt: dateFormatted },
  });
  if (existing) {
    throw new ApiError(
      400,
      "DUPLICATE_TEST_DRIVE",
      "Você já possui um agendamento para este veículo neste horário.",
    );
  }

  try {
    const testDrive = await prisma.testDrive.create({
      data: {
        carId,
        userId,
        scheduledAt: dateFormatted,
        ...(message ? { message: message.trim() } : {}),
      },
    });
    return res.status(201).json(testDrive);
  } catch (error) {
    return handleTestDriveError(error);
  }
};

export const listTestDrivesController = async (
  req: Request,
  res: Response,
) => {
  const authenticatedUserId = getAuthenticatedUserId(req);
  const requestedUserId = String(req.params.userId ?? req.params.id ?? "");
  if (authenticatedUserId !== requestedUserId) {
    throw new ApiError(403, "FORBIDDEN", "Acesso negado.");
  }

  const testDrives = await prisma.testDrive.findMany({
    where: { userId: requestedUserId },
    include: {
      car: {
        include: {
          images: { take: 1 },
        },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });
  return res.status(200).json(testDrives);
};

export const updateTestDriveController = async (
  req: Request,
  res: Response,
) => {
  const authenticatedUserId = getAuthenticatedUserId(req);
  const id = String(req.params.id ?? "");
  if (!id) {
    throw new ApiError(
      400,
      "INVALID_TEST_DRIVE_ID",
      "ID do agendamento é obrigatório.",
    );
  }

  const { scheduledAt, message } = parseUpdateTestDriveDto(req.body);
  const testDrive = await prisma.testDrive.findFirst({
    where: { id, userId: authenticatedUserId },
  });
  if (!testDrive) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Agendamento não encontrado para este usuário.",
    );
  }

  const updated = await prisma.testDrive.update({
    where: { id },
    data: {
      scheduledAt: scheduledAt ? new Date(scheduledAt) : testDrive.scheduledAt,
      message: message !== undefined ? message.trim() : testDrive.message,
    },
  });
  return res.status(200).json(updated);
};

export const deleteTestDriveController = async (
  req: Request,
  res: Response,
) => {
  const authenticatedUserId = getAuthenticatedUserId(req);
  const id = String(req.params.id ?? "");
  if (!id) {
    throw new ApiError(
      400,
      "INVALID_TEST_DRIVE_ID",
      "ID do agendamento é obrigatório.",
    );
  }

  const testDrive = await prisma.testDrive.findFirst({
    where: { id, userId: authenticatedUserId },
  });
  if (!testDrive) {
    throw new ApiError(404, "NOT_FOUND", "Agendamento não encontrado.");
  }

  await prisma.testDrive.delete({ where: { id } });
  return res.status(200).json({ message: "Test drive excluído." });
};
