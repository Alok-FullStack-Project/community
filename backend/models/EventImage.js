const mongoose = require('mongoose');

const EventImageSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    publish: { type: Boolean, default: true },

    // audit
    createdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    modifiedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'lastModifiedDate' },
  }
);

module.exports = mongoose.model('EventImage', EventImageSchema);
