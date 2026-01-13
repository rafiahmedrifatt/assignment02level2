import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const signup = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;
  console.log(payload);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email as string)) {
    throw new Error(
      "invalid email format. please provide a valid email address"
    );
  }

  const formattedEmail = (email as string).toLowerCase();
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = pool.query(
    "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, formattedEmail, hashedPassword, phone, role]
  );
  return result;
};

export const authService = {
  signup,
};
