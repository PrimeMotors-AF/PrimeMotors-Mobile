import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import {
  createProposal,
  getUserProposals,
  updateProposal,
  deleteProposal,
  getAllProposals,
  updateProposalStatus,
  deleteAdminProposal,
} from "../controllers/garageController";

const router = Router();

router.post("/proposals", authMiddleware, createProposal);
router.get("/admin/proposals", authMiddleware, adminMiddleware, getAllProposals);
router.patch("/admin/proposals/:proposalId/status", authMiddleware, adminMiddleware, updateProposalStatus);
router.delete("/admin/proposals/:proposalId", authMiddleware, adminMiddleware, deleteAdminProposal);
router.get("/:id", authMiddleware, getUserProposals);  
router.put("/:proposalId", authMiddleware, updateProposal);    
router.delete("/:proposalId", authMiddleware, deleteProposal); 

export default router;