const Family = require('../models/Family');
const FamilyMember = require('../models/FamilyMember');

const PREFIX = '42KPS';

const generateFamilyCode = async () => {
  const lastFamily = await Family.findOne().sort({ createdDate: -1 });
  if (!lastFamily) return `${PREFIX}-0001-01`;

  const lastFamilySeq = parseInt(lastFamily.headId.split('-')[1]);
  const newFamilySeq = (lastFamilySeq + 1).toString().padStart(4, '0');
  return `${PREFIX}-${newFamilySeq}-01`;
};

const generateMemberCode = async (familyId) => {
  const members = await FamilyMember.find({ familyId }).sort({ createdAt: -1 });
  const familyCode = members.length > 0 
    ? members[0].memeberID.split('-').slice(0,2).join('-') 
    : (await Family.findById(familyId)).headId.split('-').slice(0,2).join('-');

  const newSeq = (members.length + 2).toString().padStart(2, '0'); // head already -01
  return `${familyCode}-${newSeq}`;
};

// Create Family (Head)
exports.createFamily = async (req, res) => {
  try {
    const { village, name, gender, birthDate, education, profession, profession_type,
      profession_address, residence_address, martial_status, blood_group, mobile, email, remarks, publish } = req.body;

    if (!village || !name) return res.status(400).json({ message: 'Village and Name are required' });

    // Generate family head code
    const headId = await generateFamilyCode();

     const image = req.file ? `/uploads/family/${req.file.filename}` : undefined;


    const family = new Family({
      village,
      name,
      gender,
      relation: 'Head',
      birthDate,
      education,
      profession,
      profession_type,
      profession_address,
      residence_address,
      martial_status,
      blood_group,
      mobile,
      email,
      remarks,
      publish: publish !== undefined ? publish : true,
      headId,
      createdUser: req.user?._id,
      image: image || '',
    });

    await family.save();
    res.status(201).json({ success: true, data: family });
  } catch (err) {
    console.error('createFamily error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add Member to Family
exports.addMemberToFamily = async (req, res) => {
  try {
    const { familyId, village, name, gender, relation, birthDate, education, profession, profession_type,
      profession_address, residence_address, martial_status, blood_group, mobile, email, remarks, publish } = req.body;

    if (!familyId || !name) return res.status(400).json({ message: 'Family ID and Name are required' });

    // Generate member code
    const memberID = await generateMemberCode(familyId);

     const image = req.file ? `/uploads/family/${req.file.filename}` : undefined;

    const member = new FamilyMember({
      familyId,
      village,
      name,
      gender,
      relation,
      birthDate,
      education,
      profession,
      profession_type,
      profession_address,
      residence_address,
      martial_status,
      blood_group,
      mobile,
      email,
      remarks,
      publish: publish !== undefined ? publish : true,
      memeberID: memberID,
       image: image || '',
    });

    await member.save();

    // Add member reference to family
    await Family.findByIdAndUpdate(familyId, { $push: { members: member._id } });

    res.status(201).json({ success: true, data: member });
  } catch (err) {
    console.error('addMemberToFamily error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// GET /api/family
/*exports.listFamilies = async (req, res) => {
  try {
    const families = await Family.find().populate('members').sort({ createdAt: -1 });
    res.json(families);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};*/

// GET /api/family
exports.listFamilies = async (req, res) => {
  try {
    const { village } = req.query;
    const filter = {};

    if (village) {
      filter.village = village;
    }

    const families = await Family.find(filter)
      .populate('members')
      .sort({ createdAt: -1 });

    //res.json({ success: true, data: families });
     res.json(families);
  } catch (err) {
    console.error('listFamilies error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/family
exports.listFamiliesMemeber = async (req, res) => {
  try {
    let { page = 1, limit = 24, q, village } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    // Search by family or members (name, email, mobile)
    if (q) {
      const regex = new RegExp(q, 'i'); // case-insensitive
      filter.$or = [
        { name: regex },           // family name
        { mobile: regex },         // family mobile
        { email: regex },          // family email
        { 'members.name': regex }, // member name
        { 'members.mobile': regex }, 
        { 'members.email': regex },
      ];
    }

    // Filter by village
    if (village) {
      filter.village = village;
    }

    // Count total matching documents
    const total = await Family.countDocuments(filter);

    // Fetch families with members, sorted by creation date, paginated
    const families = await Family.find(filter)
      .populate('members')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: families,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET /api/family/:id
exports.getFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id).populate('members');
    if (!family) return res.status(404).json({ message: 'Family not found' });
    res.json(family);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Family Member
exports.updateFamily = async (req, res) => {
  try {
    const { id } = req.params; // memberId from URL
    const updateData = req.body;

    // Validate if member exists
    const family = await Family.findById(id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    // Update all editable fields dynamically
    Object.keys(updateData).forEach((key) => {
      family[key] = updateData[key];
    });

    // Save updated record
    const updatedMember = await family.save();

    res.status(200).json({
      message: 'Family updated successfully',
      data: updatedMember,
    });
  } catch (error) {
    console.error('Error updating Family:', error);
    res.status(500).json({ message: 'Server error while updating Family' });
  }
};

// DELETE /api/member/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    await Family.updateOne({ _id: member.familyId }, { $pull: { members: member._id } });
    await member.deleteOne();

    res.json({ message: 'Member deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMember = async (req, res) => {
  try {
    const memeber = await FamilyMember.findById(req.params.memberId);
    if (!memeber) return res.status(404).json({ message: 'Member not found' });
    res.json(memeber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Family Member
exports.updateMember = async (req, res) => {
  try {
    const { memberId } = req.params; // memberId from URL
    const updateData = req.body;

    console.log("id" + memberId);

    // Validate if member exists
    const member = await FamilyMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Update all editable fields dynamically
    Object.keys(updateData).forEach((key) => {
      member[key] = updateData[key];
    });

    // Save updated record
    const updatedMember = await member.save();

    res.status(200).json({
      message: 'Member updated successfully',
      data: updatedMember,
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Server error while updating member' });
  }
};

// DELETE /api/member/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    await Family.updateOne({ _id: member.familyId }, { $pull: { members: member._id } });
    await member.deleteOne();

    res.json({ message: 'Member deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};