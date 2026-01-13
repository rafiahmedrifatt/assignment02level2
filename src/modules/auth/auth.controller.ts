import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);
  return res
    .status(201)
    .json({ message: "User signed up successfully", data: result.rows[0] });
};

export const authController = {
  signup,
};
