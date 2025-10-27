import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import {
  getPublicPlans,
  getAllPlansAdmin,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  addFeature,
  updateFeature,
  removeFeature,
} from "../controllers/pricing.controller.js";

const router = express.Router();

// Get all pricing plans (public)
router.get("/", getPublicPlans);

// Get all pricing plans for admin (including inactive)
router.get("/admin", authenticateToken, requireRole(["admin"]), getAllPlansAdmin);

// Get single pricing plan
router.get("/:id", getPlanById);

// Create new pricing plan (admin only)
router.post("/", authenticateToken, requireRole(["admin"]), createPlan);

// Update pricing plan (admin only)
router.put("/:id", authenticateToken, requireRole(["admin"]), updatePlan);

// Delete pricing plan (admin only)
router.delete("/:id", authenticateToken, requireRole(["admin"]), deletePlan);

// Add feature to pricing plan (admin only)
router.post("/:id/features", authenticateToken, requireRole(["admin"]), addFeature);

// Update feature in pricing plan (admin only)
router.put("/:id/features/:featureId", authenticateToken, requireRole(["admin"]), updateFeature);

// Remove feature from pricing plan (admin only)
router.delete("/:id/features/:featureId", authenticateToken, requireRole(["admin"]), removeFeature);

export default router;
