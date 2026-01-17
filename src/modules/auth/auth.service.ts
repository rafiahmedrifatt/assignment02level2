import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import config from "../../config";

const signup = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email as string)) {
    throw new Error(
      "invalid email format. please provide a valid email address",
    );
  }

  const formattedEmail = (email as string).toLowerCase();
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = pool.query(
    "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING name, email, phone, role",
    [name, formattedEmail, hashedPassword, phone, role],
  );
  return result;
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  console.log({ match, user });
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    },
  );
  delete user.password;

  return { token, user };
};

export const authService = {
  signup,
  loginUser,
};
