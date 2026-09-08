require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user");
const { hashPassword } = require("../utils/password");
const connectDB = require("../config/db");

const seedAdmin = async () => {
  try {
    // Validate required environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env"
      );
    }

    // Connect to MongoDB
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();

    // Check whether an admin already exists
    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Admin already exists. No changes made.");
      return;
    }

    // Check whether the email belongs to another user
    const existingUser = await User.findOne({
      email: adminEmail,
    });

    if (existingUser) {
      throw new Error(
        `A user with the email ${adminEmail} already exists but is not an admin.`
      );
    }

    // Hash the admin password
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);

    // Create admin
    const admin = await User.create({
      firstName: "Shivansh",
      lastName: "Sharma",
      email: adminEmail,
      password: hashedPassword,
      dob: new Date("1990-01-01"),
      role: "admin",
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Admin seeder failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();