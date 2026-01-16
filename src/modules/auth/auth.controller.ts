import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);
  return res
    .status(201)
    .json({ message: "User signed up successfully", data: result.rows[0] });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);
    // console.log(result.rows[0]);
    res.status(200).json({
      success: false,
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
