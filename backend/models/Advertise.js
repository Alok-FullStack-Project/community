const mongoose = require('mongoose');

const AdvertiseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    link: { type: String},
    mobile: { type: String},
    image: { type: String }, // url or storage path
    startDate: { type: Date },
    endDate: { type: Date },
    publish: { type: Boolean, default: true },
  /*  category: {
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

module.exports = mongoose.model('Advertise', AdvertiseSchema);
