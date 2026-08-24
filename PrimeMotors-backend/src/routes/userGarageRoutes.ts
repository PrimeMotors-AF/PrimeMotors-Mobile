import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createProposal,
  getUserProposals,
  updateProposal,
  deleteProposal,
} from "../controllers/garageController";

const router = Router();

router.post("/proposals", authMiddleware, createProposal);
router.get("/:id", authMiddleware, getUserProposals);  
router.put("/:proposalId", authMiddleware, updateProposal);    
router.delete("/:proposalId", authMiddleware, deleteProposal); 

export default router;