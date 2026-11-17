import { Router } from "express";
import { getCars, getCarById } from "../services/carService";
import { ApiError } from "../errors/ApiError";

const router = Router();

// Rota para listar todos
router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const cars = await getCars(page, limit);
  return res.json(cars);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const car = await getCarById(id);
  if (!car) {
    throw new ApiError(404, "NOT_FOUND", "Carro não encontrado no banco.");
  }
  return res.json(car);
});

export default router;
