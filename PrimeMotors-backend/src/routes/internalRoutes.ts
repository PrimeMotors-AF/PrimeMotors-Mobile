import { Router } from "express";
import { timingSafeEqual } from "crypto";
import { getProposalEmailEvent } from "../controllers/internalEmailController";
import { ApiError } from "../errors/ApiError";

const router = Router();

router.get("/proposals/:proposalId/email-event", (req, res, next) => {
  const expectedToken = process.env.SERVICE_TOKEN;
  const providedToken = req.header("X-Service-Token");

  if (!expectedToken || !providedToken) {
    return next(new ApiError(401, "UNAUTHORIZED", "Token de serviço inválido."));
  }

  const expectedBuffer = Buffer.from(expectedToken, "utf8");
  const providedBuffer = Buffer.from(providedToken, "utf8");
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return next(new ApiError(401, "UNAUTHORIZED", "Token de serviço inválido."));
  }

  void getProposalEmailEvent(req, res).catch(next);
});

export default router;
