"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carService_1 = require("../services/carService");
const router = (0, express_1.Router)();
// Rota para listar todos
router.get("/", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = req.query.limit ? Number(req.query.limit) : 100;
        const cars = await (0, carService_1.getCars)(page, limit);
        res.json(cars);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar carros" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const car = await (0, carService_1.getCarById)(id);
        if (!car) {
            return res.status(404).json({ error: "Carro não encontrado no banco" });
        }
        res.json(car);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar detalhes do carro" });
    }
});
exports.default = router;
//# sourceMappingURL=carRoutes.js.map