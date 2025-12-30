const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    publish: { type: Boolean, default: true },
    event_date: { type: Date, default: null },
    place: { type: String, default: '' , trim: true },

    // optional cover image url
    coverImage: { type: String },

    // NEW FIELD
   /* category: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
         required: true
       },*/

    // audit
    createdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    modifiedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'lastModifiedDate' },
  }
);

module.exports = mongoose.model('Event', EventSchema);
