import { pool } from "../../config/db";

const createdBookings = async (req: any) => {
  const { vehicle_id, rent_start_date, rent_end_date, status } = req.body;
  try {
    const vehicle = await pool.query(
      "SELECT availability_status FROM vehicles WHERE id = $1",
      [vehicle_id]
    );

    const rentalPrice = vehicle.rows[0]?.rental_price;
    const rentalDays = Math.ceil(
      (new Date(rent_end_date).getTime() -
        new Date(rent_start_date).getTime()) /
        (1000 * 3600 * 24)
    );
    const totalCost = rentalPrice * rentalDays;

    if (vehicle.rows.length === 0) {
      return { error: "Vehicle not found" };
    }

    if (vehicle.rows[0].availability_status !== "available") {
      return { error: "Vehicle is not available for booking" };
    }

    const result = await pool.query(
      "INSERT INTO bookings (vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [vehicle_id, rent_start_date, rent_end_date, totalCost, status]
    );
    if (result.rows.length > 0) {
      await pool.query(
        "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
        [vehicle_id]
      );
      return result;
    } else {
      throw new Error("Booking creation failed");
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Could not create booking");
  }
};

export const bookingsService = {
  createdBookings,
};
