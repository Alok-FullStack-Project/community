const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema(
  {
    // 🔑 Head Info
    headId: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // Head name
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    relation: { type: String, default: 'Head' },
    birthDate: { type: Date },
    education: { type: String },
    profession: { type: String },
    profession_type: { type: String },
    profession_address: { type: String },
    residence_address: { type: String },
    marital_status: { type: String, enum: ['Married', 'UnMarried', 'Other'] },
    blood_group: { type: String },
    mobile: { type: String },
    email: { type: String },
    remarks: { type: String },
    image: { type: String },
    publish: { type: Boolean, default: true },

    // 🏡 Family Village
    village: { type: String },

    // 👨‍👩‍👧 Members (reference)
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember' }],

    // 🧾 Audit Info
    createdUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    modifiedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'lastModifiedDate' },
  }
);

// 🧹 Cascade delete members when family deleted
FamilySchema.pre('findOneAndDelete', async function (next) {
  const familyId = this.getQuery()._id;
  const FamilyMember = mongoose.model('FamilyMember');
  await FamilyMember.deleteMany({ familyId });
  next();
});

module.exports = mongoose.model('Family', FamilySchema);
