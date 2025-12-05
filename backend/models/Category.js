const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["advertise", "event"],
    },

    createdUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modifiedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "createdDate", updatedAt: "lastModifiedDate" },
  }
);

module.exports = mongoose.model("Category", CategorySchema);
