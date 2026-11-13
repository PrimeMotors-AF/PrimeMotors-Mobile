"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProposalEmailEvent = void 0;
const database_1 = __importDefault(require("../config/database"));
const getProposalEmailEvent = async (req, res) => {
    const proposal = await database_1.default.garage.findUnique({
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
        return res.status(404).json({ error: "Proposta não encontrada." });
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
exports.getProposalEmailEvent = getProposalEmailEvent;
//# sourceMappingURL=internalEmailController.js.map