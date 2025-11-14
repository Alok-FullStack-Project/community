const User = require('../models/User');
const bcrypt = require('bcryptjs');


// Create User
exports.createUser = async (req, res) => {
  try {
    let { name, email, password, role, nativePlaces, linkedEmails } = req.body;

    // Normalize input to arrays (if single value provided)
    if (nativePlaces && !Array.isArray(nativePlaces)) {
      nativePlaces = [nativePlaces];
    }
    if (linkedEmails && !Array.isArray(linkedEmails)) {
      linkedEmails = [linkedEmails];
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      passwordHash,
      role,
      nativePlaces,   // now array of villages
      linkedEmails,   // now array of head emails
    });

    await user.save();
    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

// List
exports.listUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] } : {};
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ data: users, total, limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get One
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
};

// Update
// Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role, nativePlaces = [], linkedEmails = [] } = req.body;

    // ✅ Validation for representative
    if (role === "representative") {
      if (nativePlaces.length > 0 && linkedEmails.length > 0) {
        return res.status(400).json({
          message: "A representative can have either villages or head emails, not both.",
        });
      }
    }

    const update = {
      name,
      email,
      role,
      nativePlaces,
      linkedEmails,
    };

    // ✅ Hash password if provided
    if (password) {
      update.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: err.message });
  }
};


// Delete
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
