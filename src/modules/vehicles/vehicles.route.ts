import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), vehicleController.createVehicle);
router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getSingleVehicles);
router.put("/:id", auth("admin"), vehicleController.updateVehicle);
router.delete("/:id", auth("admin"), vehicleController.deleteVehicle);
export const vehicleRoute = router;
