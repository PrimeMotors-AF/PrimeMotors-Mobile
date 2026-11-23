import dotenv from "dotenv";
import path from "path";

// Força o carregamento do .env localizado na pasta do backend
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import carsRoutes from "./routes/carRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import testDriveRoutes from "./routes/testDriveRoutes";

import prisma from "./config/database";
import { redisClient } from "./config/redis";
import userGarageRoutes from "./routes/userGarageRoutes";
import { apiRateLimit } from "./middlewares/rateLimit";
import internalRoutes from "./routes/internalRoutes";
import { requestLogger } from "./middlewares/requestLogger";
import { ApiError } from "./errors/ApiError";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler";
import { logger } from "./utils/logger";

const app = express();
app.set("trust proxy", "uniquelocal");
app.use(requestLogger);
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new ApiError(403, "ORIGIN_NOT_ALLOWED", "Origem não permitida."));
    },
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "Backend rodando com sucesso!" });
});

app.get("/health/ready", async (_req, res) => {
  const checks = await Promise.allSettled([
    prisma.$queryRaw`SELECT 1`,
    redisClient.ping(),
  ]);
  const dependencies = ["database", "redis"];
  const failedDependencies: string[] = [];

  checks.forEach((result, index) => {
    if (result.status === "rejected") {
      failedDependencies.push(dependencies[index]);
      logger.error("health.readiness_dependency_failed", {
        dependency: dependencies[index],
        requestId: _req.get("x-request-id"),
        error: result.reason,
      });
    }
  });

  if (failedDependencies.length > 0) {
    return res.status(503).json({ status: "unavailable" });
  }

  return res.status(200).json({ status: "ready" });
});

app.use(apiRateLimit);
app.use("/auth", authRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/garage", userGarageRoutes);
app.use("/internal", internalRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/cars", carsRoutes);
app.use("/test-drives", testDriveRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;