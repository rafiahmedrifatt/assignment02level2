import express, { Request, Response } from "express";
import { userRoute } from "./modules/users/users.route";
import { initDb } from "./config/db";
import { vehicleRoute } from "./modules/vehicles/vehicles.route";
import { bookingRoute } from "./modules/bookings/bookings.route";
import { authRoute } from "./modules/auth/auth.route";

initDb();
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Vehicle Rental Service API");
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/auth", authRoute);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
