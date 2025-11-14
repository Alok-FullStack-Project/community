const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilyMemberSchema = new Schema(
  {
    memberID: { type: String },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true },

    // 🏠 Each member can belong to different village
    village: { type: String },

    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    relation: { type: String }, // Wife, Son, Daughter, etc.
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
    publish: { type: Boolean, default: true },
    image: { type: String },
  },
  { timestamps: true }
);

// 🧠 Static method to promote a new head
FamilyMemberSchema.statics.promoteToHead = async function (familyId, memberId) {
  const Family = mongoose.model('Family');
  const FamilyMember = mongoose.model('FamilyMember');

  // Get the new head member
  const newHead = await FamilyMember.findById(memberId);
  if (!newHead) throw new Error('Member not found');

  // Update Family with new head details
  await Family.findByIdAndUpdate(
    familyId,
    {
      name: newHead.name,
      gender: newHead.gender,
      relation: 'Head',
      birthDate: newHead.birthDate,
      education: newHead.education,
      profession: newHead.profession,
      profession_type: newHead.profession_type,
      profession_address: newHead.profession_address,
      residence_address: newHead.residence_address,
      marital_status: newHead.marital_status,
      blood_group: newHead.blood_group,
      mobile: newHead.mobile,
      email: newHead.email,
      remarks: newHead.remarks,
      image: newHead.image,
      modifiedUser: newHead.modifiedUser,
    },
    { new: true }
  );

  // Remove promoted member from member list
  await FamilyMember.findByIdAndDelete(memberId);

  return newHead;
};

module.exports = mongoose.model('FamilyMember', FamilyMemberSchema);
