import { Request, Response } from "express";
import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users;`
  );
  return result;
};

// const getSingleUser = async (id: string) => {
//   const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
//   return result;
// };

const updateUser = async (payload: any, userRole: string) => {
  if (userRole === "admin") {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id, name, email, phone, role;`,
      [payload.name, payload.email, payload.phone, userRole, payload.id]
    );
    return result;
  }
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$5 RETURNING id, name, email, phone, role;`,
    [payload.name, payload.email, payload.phone, payload.id]
  );
  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getAllUsers,
  // getSingleUser,
  updateUser,
  deleteUser,
};
