import { Request, Response } from "express";
import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users;`);
  return result;
};

export const userServices = {
  getAllUsers,
};
