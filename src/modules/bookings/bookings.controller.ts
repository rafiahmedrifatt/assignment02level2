import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createdBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsService.createdBookings(req);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsService.getBookings(req, req.user.role);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsService.updateBookings(
      req,
      req.params.bookingId,
    );

    // Handle error responses from service
    if (result.error) {
      return res.status(result.status || 400).json({
        success: false,
        message: result.error,
      });
    }

    res.status(result.status || 200).json({
      success: true,
      message: "Booking updated successfully",
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      errors: error,
    });
  }
};

export const bookingsController = {
  createdBookings,
  getBookings,
  updateBookings,
};
