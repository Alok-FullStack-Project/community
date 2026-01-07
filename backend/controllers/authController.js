const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      nativePlaces = [],
      description
    } = req.body;

    // ✅ Require email OR phone
    if (!email && !phone) {
      return res.status(400).json({
        message: "Email or phone is required"
      });
    }

    // ✅ Check duplicate email or phone
    const existing = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean)
    });

    if (existing) {
      return res.status(400).json({
        message: existing.email === email
          ? "Email already exists"
          : "Phone already exists"
      });
    }

    // ✅ Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      description,
      passwordHash,
      role: role || "user",
      nativePlaces,
      linkedEmails: []
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        nativePlaces: user.nativePlaces,
        linkedEmails: user.linkedEmails
      }
    });

  } catch (err) {
    console.error(err);

    // ✅ Handle mongoose unique constraint errors
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email or phone already exists"
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Email/Phone and password are required" });
    }

    // 🔹 Find by email OR phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        nativePlaces: user.nativePlaces,
        linkedEmails: user.linkedEmails,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
