const mongoose = require('mongoose');

const VillageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    publish: { type: Boolean, default: true },

    // audit
    createdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    modifiedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'lastModifiedDate' },
  }
);

module.exports = mongoose.model('Village', VillageSchema);
