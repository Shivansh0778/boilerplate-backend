const User = require("../models/user");
const { hashPassword } = require("../utils/password");
const crypto = require("crypto");


const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Get users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, dob, role } = req.body;

    if (!firstName || !lastName || !email || !dob) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate a secure temporary password
    const temporaryPassword = crypto.randomBytes(12).toString("base64url");

    // Hash password before storing it
    const hashedPassword = await hashPassword(temporaryPassword);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dob,
      role: role || "user",
    });

    return res.status(201).json({
      success: true,
      message:
        "User created successfully. Login credentials have been sent to the user's email.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Create user error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateUser = async function (req, res) {
  try {
    const { firstName, lastName, email, dob, role } = req.body;

    const updateData = {
      firstName,
      lastName,
      email,
      dob,
      role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Update user error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteUser = async function (req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Delete user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
