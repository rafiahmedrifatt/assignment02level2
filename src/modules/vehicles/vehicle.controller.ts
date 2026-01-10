import { Request, Response } from "express";
import { pool } from "../../database/db";
import { vehicleServices } from "./vehicle.service";
import { updateLanguageServiceSourceFile } from "typescript";

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    res.status(200).json(result.rows);
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
      availability_status
    );

    console.log(result);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
};

const getSingleVehicles = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.id;
    const result = await vehicleServices.getSingleVehicles(vehicleId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.id;

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
      availability_status
    );

    if (updatedVehicle.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
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
  const vehicleId = req.params.id;
  try {
    const result = await vehicleServices.deleteVehicles(vehicleId);
    if (result.rowCount === 0) {
      res.status(500).json({ message: "no vehicles found" });
    }
    res.status(200).json({ message: "vehicle deleted successfully" });
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
