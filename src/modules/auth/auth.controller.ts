import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result.rows[0],
  });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signup,
  loginUser,
};
