// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
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

module.exports = mongoose.model("User", UserSchema);
