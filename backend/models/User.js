// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, sparse: true, unique: true },
   // ✅ New fields
  phone: {
    type: String,
    trim: true,
    sparse: true,
    unique: true
  },

  description: {
    type: String,
    trim: true,
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "representative", "user"],
    default: "user",
  },

  // ✅ Multiple villages or emails allowed
  nativePlaces: [{ type: String }], // e.g. ["VillageA", "VillageB"]
  linkedEmails: [{ type: String }], // e.g. ["head1@gmail.com", "head2@gmail.com"]

  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    this.invalidate("email", "Either email or phone is required");
    this.invalidate("phone", "Either phone or email is required");
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
