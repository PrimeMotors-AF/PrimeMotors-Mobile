"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProposals = exports.deleteProposal = exports.updateProposal = exports.createProposal = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const parsePaginationParam = (value, fallback) => {
    const pageString = Array.isArray(value) ? value[0] : value;
    const parsed = Number(pageString);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};
const getUser = (req) => req.user?.id;
const getId = (req, param) => String(req.params[param]);
const findProposal = (id) => database_1.default.garage.findUnique({ where: { id } });
const createProposal = async (req, res) => {
    const userId = getUser(req);
    if (!userId)
        return res.status(401).json({ error: "Não autenticado." });
    const { offeredValue, message, carId } = req.body;
    if (!carId || offeredValue == null)
        return res
            .status(400)
            .json({ error: "carId e offeredValue obrigatórios." });
    try {
        const alreadyExists = await database_1.default.garage.findFirst({
            where: { userId, carId, status: "Pendente" },
        });
        if (alreadyExists)
            return res
                .status(409)
                .json({ error: "Já existe uma proposta pendente para este veículo." });
        const proposal = await database_1.default.garage.create({
            data: { offeredValue, message, carId, userId, status: "Pendente" }, // ✅ sem carImageUrl
        });
        return res.status(201).json(proposal);
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2002")
            return res
                .status(409)
                .json({ error: "Já existe uma proposta igual em aberto." });
        console.error(error);
        return res.status(500).json({ error: "Erro ao criar proposta." });
    }
};
exports.createProposal = createProposal;
const updateProposal = async (req, res) => {
    const userId = getUser(req);
    if (!userId)
        return res.status(401).json({ error: "Não autenticado." });
    const id = getId(req, "proposalId");
    const { offeredValue, message } = req.body;
    if (!offeredValue || isNaN(Number(offeredValue)))
        return res.status(400).json({ error: "offeredValue inválido." });
    try {
        const proposal = await findProposal(id);
        if (!proposal)
            return res.status(404).json({ error: "Proposta não encontrada." });
        if (proposal.userId !== userId)
            return res.status(403).json({ error: "Acesso negado." });
        const updated = await database_1.default.garage.update({
            where: { id },
            data: { offeredValue: Number(offeredValue), message },
        });
        return res.status(200).json(updated);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao atualizar proposta." });
    }
};
exports.updateProposal = updateProposal;
const deleteProposal = async (req, res) => {
    const userId = getUser(req);
    if (!userId)
        return res.status(401).json({ error: "Não autenticado." });
    const id = getId(req, "proposalId");
    try {
        const proposal = await findProposal(id);
        if (!proposal)
            return res.status(404).json({ error: "Proposta não encontrada." });
        if (proposal.userId !== userId)
            return res.status(403).json({ error: "Acesso negado." });
        await database_1.default.garage.delete({ where: { id } });
        return res.status(200).json({ message: "Excluída com sucesso." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao excluir proposta." });
    }
};
exports.deleteProposal = deleteProposal;
const getUserProposals = async (req, res) => {
    const userId = getUser(req);
    if (!userId)
        return res.status(401).json({ error: "Não autenticado." });
    if (getId(req, "id") !== userId)
        return res.status(403).json({ error: "Acesso negado." });
    try {
        const page = parsePaginationParam(req.query.page, 1);
        const limit = parsePaginationParam(req.query.limit, 10);
        const proposals = await database_1.default.garage.findMany({
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
        return res.status(200).json(proposals.map((p) => ({
            id: p.id,
            offeredValue: p.offeredValue,
            status: p.status,
            imgUrl: p.car?.images[0]?.url ?? null,
            name: p.car?.name ?? "Veículo não identificado",
            message: p.message,
            date_offer: p.date_offer,
        })));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar propostas." });
    }
};
exports.getUserProposals = getUserProposals;
//# sourceMappingURL=garageController.js.map