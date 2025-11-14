const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    publish: { type: Boolean, default: true },

    // optional cover image url
    coverImage: { type: String },

    // audit
    createdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    modifiedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'lastModifiedDate' },
  }
);

module.exports = mongoose.model('Event', EventSchema);
