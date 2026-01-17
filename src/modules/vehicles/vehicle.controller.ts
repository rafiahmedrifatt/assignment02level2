import { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehicleServices } from "./vehicle.service";
import { updateLanguageServiceSourceFile } from "typescript";

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No vehicles found",
        data: result.rows,
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    const result = await vehicleServices.createVehicles(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    );
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
};

const getSingleVehicles = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.id as string;
    const result = await vehicleServices.getSingleVehicles(vehicleId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.id as string;

    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    console.log(req.body);

    const updatedVehicle = await vehicleServices.updateVehicles(
      vehicleId,
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    );

    if (updatedVehicle.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle.rows[0],
    });
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const vehicleId = req.params.id as string;
  try {
    const result = await vehicleServices.deleteVehicles(vehicleId);
    if (result.rowCount === 0) {
      res.status(500).json({ message: "no vehicles found" });
    }
    res
      .status(200)
      .json({ success: true, message: "vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const vehicleController = {
  getVehicles,
  createVehicle,
  getSingleVehicles,
  updateVehicle,
  deleteVehicle,
};
