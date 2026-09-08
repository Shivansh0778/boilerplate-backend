const User = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, dob } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !dob
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password do not match",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dob,
    });

    return res.status(201).json({
      message: "User registered successfully",
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
    console.log("Signup error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
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
    console.log("Login error:", error.message);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
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
    console.log("Get me error:", error.message);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
};
