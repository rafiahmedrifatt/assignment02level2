import { pool } from "../../database/db";

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles;`);
  return result;
};

const createVehicles = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: boolean
) => {
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getSingleVehicles = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1;`, [
    vehicleId,
  ]);
  return result;
};

const updateVehicles = async (
  vehicleId: string,
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: boolean
) => {
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *;`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );

  return result;
};

const deleteVehicles = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM vehicles WHERE id = $1 AND availability_status = 'available'",
    [id]
  );
  return result;
};

export const vehicleServices = {
  getAllVehicles,
  createVehicles,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
