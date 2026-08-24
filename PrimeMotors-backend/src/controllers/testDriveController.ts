import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// Captura o ID do usuário autenticado injetado pelo middleware de autenticação
const getUserIdFromRequest = (req: Request) => req.user?.id;

// ==========================================
// 1. CRIAR AGENDAMENTO (CREATE)
// ==========================================
export const createTestDriveController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  const { carId, scheduledAt, message } = req.body;
  if (!carId || !scheduledAt) {
    return res.status(400).json({ error: "carId e scheduledAt são obrigatórios." });
  }

  try {
    const dateFormatted = new Date(scheduledAt);
    const parsedCarId = String(carId);

    // Valida se já existe agendamento idêntico para o mesmo usuário, carro e horário
    const existing = await prisma.testDrive.findFirst({
      where: { 
        carId: parsedCarId, 
        userId: authenticatedUserId, 
        scheduledAt: dateFormatted 
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Você já possui um agendamento para este veículo neste horário." });
    }

    const testDrive = await prisma.testDrive.create({
      data: { 
        carId: parsedCarId, 
        userId: authenticatedUserId, 
        scheduledAt: dateFormatted,
        ...(message && { message: String(message).trim() })
      },
    });

    return res.status(201).json(testDrive);
  } catch (error: any) {
    console.error("ERRO COMPLETO DO PRISMA:", error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "Este agendamento já existe." });
    }
    return res.status(500).json({ error: "Erro interno ao agendar test drive." });
  }
};

// ==========================================
// 2. LISTAR POR USUÁRIO (READ)
// ==========================================
export const listTestDrivesController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  const requestedUserId = (req.params.userId || req.params.id) as string;

  if (!authenticatedUserId) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  if (authenticatedUserId !== requestedUserId) {
    return res.status(403).json({ error: "Acesso negado." });
  }

  try {
    const testDrives = await prisma.testDrive.findMany({
      where: { userId: requestedUserId },
      include: {
        car: {
          include: {
            images: { take: 1 }, // Traz a primeira imagem perfeitamente para o Card
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });
    return res.status(200).json(testDrives);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar os agendamentos do usuário." });
  }
};

// ==========================================
// 3. ATUALIZAR AGENDAMENTO (UPDATE)
// ==========================================
export const updateTestDriveController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  const id = req.params.id as string;
  const { scheduledAt, message } = req.body; // AJUSTE: Capturando a message vinda do formulário de edição

  if (!id) return res.status(400).json({ error: "ID do agendamento é obrigatório." });

  try {
    const agendamento = await prisma.testDrive.findFirst({
      where: { id, userId: authenticatedUserId },
    });

    if (!agendamento) {
      return res.status(404).json({ error: "Agendamento não encontrado para este usuário." });
    }

    // AJUSTE: Atualiza a data e também a observação se ela for enviada
    const updated = await prisma.testDrive.update({
      where: { id },
      data: { 
        scheduledAt: scheduledAt ? new Date(scheduledAt) : agendamento.scheduledAt,
        message: message !== undefined ? String(message).trim() : agendamento.message
      },
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar o agendamento." });
  }
};

// ==========================================
// 4. EXCLUIR AGENDAMENTO (DELETE)
// ==========================================
export const deleteTestDriveController = async (req: Request, res: Response) => {
  const authenticatedUserId = getUserIdFromRequest(req);
  if (!authenticatedUserId) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  const id = req.params.id as string;
  if (!id) return res.status(400).json({ error: "ID do agendamento é obrigatório." });

  try {
    const agendamento = await prisma.testDrive.findFirst({
      where: { id, userId: authenticatedUserId },
    });

    if (!agendamento) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    await prisma.testDrive.delete({ where: { id } });
    return res.status(200).json({ message: "Test drive excluído." });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao excluir o agendamento." });
  }
};