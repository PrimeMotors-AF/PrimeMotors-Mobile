"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestDriveController = exports.updateTestDriveController = exports.listTestDrivesController = exports.createTestDriveController = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../config/database"));
// Captura o ID do usuário autenticado injetado pelo middleware de autenticação
const getUserIdFromRequest = (req) => req.user?.id;
// ==========================================
// 1. CRIAR AGENDAMENTO (CREATE)
// ==========================================
const createTestDriveController = async (req, res) => {
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
        const existing = await database_1.default.testDrive.findFirst({
            where: {
                carId: parsedCarId,
                userId: authenticatedUserId,
                scheduledAt: dateFormatted
            },
        });
        if (existing) {
            return res.status(400).json({ error: "Você já possui um agendamento para este veículo neste horário." });
        }
        const testDrive = await database_1.default.testDrive.create({
            data: {
                carId: parsedCarId,
                userId: authenticatedUserId,
                scheduledAt: dateFormatted,
                ...(message && { message: String(message).trim() })
            },
        });
        return res.status(201).json(testDrive);
    }
    catch (error) {
        console.error("ERRO COMPLETO DO PRISMA:", error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return res.status(409).json({ error: "Este agendamento já existe." });
        }
        return res.status(500).json({ error: "Erro interno ao agendar test drive." });
    }
};
exports.createTestDriveController = createTestDriveController;
// ==========================================
// 2. LISTAR POR USUÁRIO (READ)
// ==========================================
const listTestDrivesController = async (req, res) => {
    const authenticatedUserId = getUserIdFromRequest(req);
    const requestedUserId = (req.params.userId || req.params.id);
    if (!authenticatedUserId) {
        return res.status(401).json({ error: "Não autenticado." });
    }
    if (authenticatedUserId !== requestedUserId) {
        return res.status(403).json({ error: "Acesso negado." });
    }
    try {
        const testDrives = await database_1.default.testDrive.findMany({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar os agendamentos do usuário." });
    }
};
exports.listTestDrivesController = listTestDrivesController;
// ==========================================
// 3. ATUALIZAR AGENDAMENTO (UPDATE)
// ==========================================
const updateTestDriveController = async (req, res) => {
    const authenticatedUserId = getUserIdFromRequest(req);
    if (!authenticatedUserId) {
        return res.status(401).json({ error: "Não autenticado." });
    }
    const id = req.params.id;
    const { scheduledAt, message } = req.body; // AJUSTE: Capturando a message vinda do formulário de edição
    if (!id)
        return res.status(400).json({ error: "ID do agendamento é obrigatório." });
    try {
        const agendamento = await database_1.default.testDrive.findFirst({
            where: { id, userId: authenticatedUserId },
        });
        if (!agendamento) {
            return res.status(404).json({ error: "Agendamento não encontrado para este usuário." });
        }
        // AJUSTE: Atualiza a data e também a observação se ela for enviada
        const updated = await database_1.default.testDrive.update({
            where: { id },
            data: {
                scheduledAt: scheduledAt ? new Date(scheduledAt) : agendamento.scheduledAt,
                message: message !== undefined ? String(message).trim() : agendamento.message
            },
        });
        return res.status(200).json(updated);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao atualizar o agendamento." });
    }
};
exports.updateTestDriveController = updateTestDriveController;
// ==========================================
// 4. EXCLUIR AGENDAMENTO (DELETE)
// ==========================================
const deleteTestDriveController = async (req, res) => {
    const authenticatedUserId = getUserIdFromRequest(req);
    if (!authenticatedUserId) {
        return res.status(401).json({ error: "Não autenticado." });
    }
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ error: "ID do agendamento é obrigatório." });
    try {
        const agendamento = await database_1.default.testDrive.findFirst({
            where: { id, userId: authenticatedUserId },
        });
        if (!agendamento) {
            return res.status(404).json({ error: "Agendamento não encontrado." });
        }
        await database_1.default.testDrive.delete({ where: { id } });
        return res.status(200).json({ message: "Test drive excluído." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao excluir o agendamento." });
    }
};
exports.deleteTestDriveController = deleteTestDriveController;
//# sourceMappingURL=testDriveController.js.map