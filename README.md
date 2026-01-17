# 🚗 Vehicle Rental System

A backend API for managing vehicle rentals, built with Node.js, TypeScript, and PostgreSQL.

**Live Repository**: [https://github.com/rafiahmedrifatt/vehicle-rental-system-backend](https://github.com/rafiahmedrifatt/vehicle-rental-system-backend)

## ✨ Features

- Vehicle inventory management with availability tracking
- User registration and authentication with JWT
- Role-based access (Admin and Customer)
- Booking management with automatic price calculation
- Secure password hashing with bcrypt

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/rafiahmedrifatt/vehicle-rental-system-backend.git
cd vehicle-rental-system-backend
```

2. Install dependencies:
```bash
npm install
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=vehicle_rental_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

## 🗄️ Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE vehicle_rental_db;
```

2. Run database migrations (if using migration tools) or execute the schema:

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price DECIMAL(10, 2) CHECK (daily_rent_price > 0) NOT NULL,
    availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
    total_price DECIMAL(10, 2) CHECK (total_price > 0) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
```

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "role": "customer"
}
```

#### Login
```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Vehicle Endpoints

#### Create Vehicle (Admin Only)
```http
POST /api/v1/vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50.00,
  "availability_status": "available"
}
```

#### Get All Vehicles
```http
GET /api/v1/vehicles
```

#### Get Vehicle by ID
```http
GET /api/v1/vehicles/:vehicleId
```

#### Update Vehicle (Admin Only)
```http
PUT /api/v1/vehicles/:vehicleId
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry 2024",
  "daily_rent_price": 55.00
}
```

#### Delete Vehicle (Admin Only)
```http
DELETE /api/v1/vehicles/:vehicleId
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users (Admin Only)
```http
GET /api/v1/users
Authorization: Bearer <token>
```

#### Update User
```http
PUT /api/v1/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567899"
}
```

#### Delete User (Admin Only)
```http
DELETE /api/v1/users/:userId
Authorization: Bearer <token>
```

### Booking Endpoints

#### Create Booking
```http
POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_id": 1,
  "rent_start_date": "2024-02-01",
  "rent_end_date": "2024-02-05"
}
```

#### Get Bookings
```http
GET /api/v1/bookings
Authorization: Bearer <token>
```

#### Update Booking Status
```http
PUT /api/v1/bookings/:bookingId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "cancelled"
}
```

## 📁 Project Structure

```
vehicle-rental-system-backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   └── users.validation.ts
│   │   ├── vehicles/
│   │   │   ├── vehicles.controller.ts
│   │   │   ├── vehicles.service.ts
│   │   │   ├── vehicles.routes.ts
│   │   │   └── vehicles.validation.ts
│   │   └── bookings/
│   │       ├── bookings.controller.ts
│   │       ├── bookings.service.ts
│   │       ├── bookings.routes.ts
│   │       └── bookings.validation.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── environment.ts
│   ├── utils/
│   │   ├── jwt.utils.ts
│   │   └── bcrypt.utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register or login to receive a JWT token
2. Include the token in the Authorization header of your requests:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## 👥 User Roles

### Admin
- Full access to all system features
- Manage all vehicles, users, and bookings
- Update user roles
- Delete users and vehicles (with constraints)

### Customer
- Register and manage own profile
- View available vehicles
- Create and manage own bookings
- Cancel bookings before start date

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Rafi Ahmed**
- GitHub: [@rafiahmedrifatt](https://github.com/rafiahmedrifatt)

**Happy Coding! 🚀**
