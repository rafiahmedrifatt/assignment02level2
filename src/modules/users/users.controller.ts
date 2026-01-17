import { Request, Response } from "express";
import { userServices } from "./users.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.updateUser(req.body, req.user.role);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
