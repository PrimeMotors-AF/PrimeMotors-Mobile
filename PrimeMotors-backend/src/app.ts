import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import carsRoutes from "./routes/carRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import testDriveRoutes from "./routes/testDriveRoutes";

import {
  getUserController,
  updateUserController,
} from "./controllers/userController";
import userGarageRoutes from "./routes/userGarageRoutes";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origem não permitida pelo CORS"));
    },
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "Backend rodando com sucesso!" });
});

app.use("/auth", authRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/garage", userGarageRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/cars", carsRoutes);
app.use("/test-drives", testDriveRoutes);
export default app;
