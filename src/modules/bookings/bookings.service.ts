import { json } from "express";
import { pool } from "../../config/db";

const createdBookings = async (payload: Record<string, any>) => {
  const { vehicle_id, rent_start_date, rent_end_date, status } = payload.body;
  try {
    const vehicle = await pool.query(
      "SELECT availability_status, daily_rent_price FROM vehicles WHERE id = $1",
      [vehicle_id],
    );

    const rentalPrice = vehicle.rows[0]?.daily_rent_price;
    const rentalDays = Math.ceil(
      (new Date(rent_end_date).getTime() -
        new Date(rent_start_date).getTime()) /
        (1000 * 3600 * 24),
    );
    const totalCost = rentalPrice * rentalDays;

    console.log(totalCost);

    if (vehicle.rows.length === 0) {
      return { error: "Vehicle not found" };
    }

    if (vehicle.rows[0].availability_status !== "available") {
      return { error: "Vehicle is not available for booking" };
    }

    console.log(payload.user);

    const result = await pool.query(
      "INSERT INTO bookings (vehicle_id, customer_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        vehicle_id,
        payload.user.id,
        rent_start_date,
        rent_end_date,
        totalCost,
        status,
      ],
    );
    if (result.rows.length > 0) {
      await pool.query(
        "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
        [vehicle_id],
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

const getBookings = async (payload: Record<string, any>, userRole: string) => {
  try {
    if (userRole === "customer") {
      const result = await pool.query(
        "SELECT * FROM bookings WHERE customer_id = $1",
        [payload.user.id],
      );
      return result;
    }
    const result = await pool.query("SELECT * FROM bookings");
    return result;
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    throw new Error("Could not retrieve bookings");
  }
};

const updateBookings = async (
  payload: Record<string, any>,
  bookingId?: string,
) => {
  const userRole = payload.user.role;
  const userId = payload.user.id;
  const today = new Date().toLocaleDateString("en-CA");

  try {
    const bookingResult = await pool.query(
      "SELECT * FROM bookings WHERE id = $1",
      [bookingId],
    );

    if (bookingResult.rows.length === 0) {
      return { error: "Booking not found", status: 404 };
    }

    const booking = bookingResult.rows[0];
    const rentStartDate = new Date(booking.rent_start_date)
      .toLocaleDateString("en-CA")
      .split("/")
      .reverse()
      .join("-");
    const rentEndDate = new Date(booking.rent_end_date)
      .toLocaleDateString("en-CA")
      .split("/")
      .reverse()
      .join("-");

    if (userRole === "customer") {
      if (booking.customer_id !== userId) {
        return {
          error: "Unauthorized: You can only cancel your own bookings",
          status: 403,
        };
      }
      if (today >= rentStartDate) {
        return {
          error: "Cannot cancel booking after start date",
          status: 400,
        };
      }
      if (booking.status !== "active") {
        return {
          error: `Cannot cancel a ${booking.status} booking`,
          status: 400,
        };
      }

      const result = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        ["cancelled", bookingId],
      );


      await pool.query(
        `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
        ["available", booking.vehicle_id],
      );

      return { data: result.rows[0], status: 200 };
    }

    // Admin: Mark as "returned" and update vehicle to "available"
    if (userRole === "admin") {
      // Check if already returned or cancelled
      if (booking.status !== "active") {
        return {
          error: `Cannot mark a ${booking.status} booking as returned`,
          status: 400,
        };
      }

      // Mark as returned
      const result = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        ["returned", bookingId],
      );

      // Update vehicle status to available
      await pool.query(
        `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
        ["available", booking.vehicle_id],
      );

      return { data: result.rows[0], status: 200 };
    }

    return {
      error: "Unauthorized: Invalid role",
      status: 403,
    };
  } catch (error) {
    console.error("Error updating booking:", error);
    throw new Error("Could not update booking");
  }
};

export const bookingsService = {
  createdBookings,
  getBookings,
  updateBookings,
};
