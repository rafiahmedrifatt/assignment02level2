import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingsController.createdBookings);

router.get("/", auth("admin", "customer"), bookingsController.getBookings);

router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingsController.updateBookings,
);

export const bookingRoute = router;
