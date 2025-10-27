import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  stopService,
  restartService,
  deleteService,
  getServiceByBuisenessId
} from "../controllers/services.controller.js";

const router = express.Router();

// Create new service
router.post("/create", createService);

// Get all services
router.get("/", getAllServices);

// Get service by ID
router.get("/:id", getServiceById);

//Get service by business ID
router.get("/business/:businessId", getServiceByBuisenessId)

// Stop service
router.post("/:id/stop", stopService);

// Restart service
router.post("/:id/restart", restartService);

// Delete service
router.delete("/:id", deleteService);

export default router;