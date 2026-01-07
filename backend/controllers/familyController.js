const Family = require("../models/Family");
const FamilyMember = require("../models/FamilyMember");
const mongoose = require("mongoose");
const imagekit = require("../utils/imagekit");

const PREFIX = '42KPS';

const generateFamilyCode = async () => {
  const lastFamily = await Family.findOne().sort({ createdDate: -1 });
  if (!lastFamily) return `${PREFIX}-0001-01`;

  const lastFamilySeq = parseInt(lastFamily.headId.split('-')[1]);
  const newFamilySeq = (lastFamilySeq + 1).toString().padStart(4, '0');
  return `${PREFIX}-${newFamilySeq}-01`;
};

/*const generateMemberCode = async (familyId) => {
  const members = await FamilyMember.find({ familyId }).sort({ createdAt: -1 });
  const familyCode = members.length > 0 
    ? members[0].memeberID.split('-').slice(0,2).join('-') 
    : (await Family.findById(familyId)).headId.split('-').slice(0,2).join('-');

  const newSeq = (members.length + 2).toString().padStart(2, '0'); // head already -01
  return `${familyCode}-${newSeq}`;
}; */

/*const generateMemberCode = async (familyId) => {
  //const Family = mongoose.model('Family');
  //const FamilyMember = mongoose.model('FamilyMember');

  // Fetch all members of this family
  const members = await FamilyMember.find({ familyId }).sort({ createdAt: -1 });

  // Get family base code
  let familyCode;
  if (members.length > 0 && members[0].memberID) {
    // Example: FAM-001-03 → take FAM-001
    familyCode = members[0].memberID.split('-').slice(0, 2).join('-');
  } else {
    const family = await Family.findById(familyId);
    if (!family || !family.headId) throw new Error('Family or headId not found');
    familyCode = family.headId.split('-').slice(0, 2).join('-');
  }

  // Next sequence number (head already uses -01)
  const newSeq = (members.length + 2).toString().padStart(2, '0');

  return `${familyCode}-${newSeq}`;
};*/

const generateMemberCode = async (familyId) => {
  // Get all members of the family
  const members = await FamilyMember.find({ familyId });

  // Determine family base code
  let familyCode;
  if (members.length > 0 && members[0].memberID) {
    familyCode = members[0].memberID.split('-').slice(0, 2).join('-');
  } else {
    const family = await Family.findById(familyId);
    if (!family || !family.headId) throw new Error('Family or headId not found');
    familyCode = family.headId.split('-').slice(0, 2).join('-');
  }

  // Extract max numeric sequence from all memberIDs (last segment)
  let maxSeq = 1; // default if no members yet

  members.forEach(m => {
    if (m.memberID) {
      const parts = m.memberID.split('-');
      const seq = parseInt(parts[parts.length - 1]);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  });

  // Increment sequence
  const newSeq = (maxSeq + 1).toString().padStart(2, '0');

  // Return full new member code
  return `${familyCode}-${newSeq}`;
};


// ➕ Create Family (with optional members)
exports.createFamily = async (req, res) => {
  try {
    const {  name, gender, village, members = [] } = req.body;

     // Generate family head code
    const headId = await generateFamilyCode();

        //    const image = req.file ? `/uploads/family/${req.file.filename}` : undefined;
        let image = "";
          if (req.file) {
            const uploadRes = await imagekit.upload({
              file: req.file.buffer,
              fileName: req.file.originalname,
              folder: "/family",
            });
      
            image = uploadRes.url;
          }

    // Create Family first
    const family = new Family({
      headId,
      name,
      gender,
      village,
      image,
      ...req.body,
      createdUser: req.user._id, // assuming user is authenticated
    });

    await family.save();

    // Add members if provided
    if (members.length > 0) {
      const memberDocs = members.map((m) => ({
        ...m,
        familyId: family._id,
      }));
      const savedMembers = await FamilyMember.insertMany(memberDocs);

      // Update Family's members list
      family.members = savedMembers.map((m) => m._id);
      await family.save();
    }

    res.status(201).json({ message: "Family created successfully", data: family });
  } catch (error) {
    console.error("Error creating family:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 List Families (with search + pagination)
/*exports.listFamilies = async (req, res) => {
  try {
    let { page = 1, limit = 20, q, village } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (village) filter.village = village;

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { name: regex },
        { mobile: regex },
        { email: regex },
        { "members.name": regex },
      ];
    }

    const families = await Family.find(filter)
      .populate("members")
      .sort({ createdDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Family.countDocuments(filter);

    res.json({ total, page, limit, data: families });
  } catch (error) {
    console.error("Error listing families:", error);
    res.status(500).json({ message: "Server error" });
  }
}; */

// 📋 List Families (search + pagination, search across Family + FamilyMember)
exports.listFamilies = async (req, res) => {
  try {
    let { page = 1, limit = 20, q, village } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    // ✅ Filter by village if provided
    if (village) filter.village = village;

    let familyIdsFromMembers = [];

    if (q) {
      const regex = new RegExp(q, "i");

      // Step 1️⃣: Find FamilyMembers matching query
      const matchedMembers = await FamilyMember.find({
        $or: [{ name: regex }, { email: regex }, { mobile: regex }],
      }).select("familyId");

      // Step 2️⃣: Collect family IDs
      familyIdsFromMembers = matchedMembers.map((m) => m.familyId);

      // Step 3️⃣: Add OR filter for Family fields + familyIdsFromMembers
      filter.$or = [
        { name: regex },
        { email: regex },
        { mobile: regex },
        { blood_group: regex },
        { profession: regex },
        { education: regex },
        { profession_address: regex },
        { residence_address: regex },
        { _id: { $in: familyIdsFromMembers } },
      ];
    }  //   

    // Step 4️⃣: Query Family collection
    const families = await Family.find(filter)
      .populate("members")
      .sort({ createdDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const familyCount = await Family.countDocuments(filter);
   

     // 🔹 No filter → all members
    if (Object.keys(filter).length === 0) {
      memberCount = await FamilyMember.countDocuments({});
    }
    // 🔹 Filter applied → members of filtered families
    else {
      const familyIds = families.map(f => f._id);
      
      memberCount = await FamilyMember.countDocuments({
        familyId : { $in: familyIds },
      });
    }


     let totalRegistered = familyCount + memberCount;

    res.json({familyCount,memberCount, totalRegistered,total : familyCount, page, limit, data: families });
  } catch (error) {
    console.error("Error listing families:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/*exports.listFamilies = async (req, res) => {
  try {
    let { page = 1, limit = 20, q, village } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const user = req.user; // logged-in user
    console.log(user);
    const filter = {};

    // 🧩 Role-based filters
    if (user.role === "representative") {
      // Representative → can view families by nativePlaces or linkedEmails
      const orConditions = [];

      if (Array.isArray(user.nativePlaces) && user.nativePlaces.length > 0) {
        orConditions.push({ village: { $in: user.nativePlaces } });
      }

      if (Array.isArray(user.linkedEmails) && user.linkedEmails.length > 0) {
        orConditions.push({ email: { $in: user.linkedEmails } });
      }

      if (orConditions.length > 0) {
        filter.$or = orConditions;
      } else {
        // If representative not linked to any village/email, show nothing
        return res.json({ total: 0, page, limit, data: [] });
      }
    } 
    else if (user.role === "user") {
      // Normal user → show only their created families
      filter.createdUser = user._id;
    }
    // Admin → no restrictions

    // ✅ Additional manual filters
    if (village) filter.village = village;

    // ✅ Text search across Family & FamilyMember
    let familyIdsFromMembers = [];
    if (q) {
      const regex = new RegExp(q, "i");

      // Find FamilyMembers matching query
      const matchedMembers = await FamilyMember.find({
        $or: [{ name: regex }, { email: regex }, { mobile: regex }],
      }).select("familyId");

      familyIdsFromMembers = matchedMembers.map((m) => m.familyId);

      // Add OR condition
      filter.$or = [
        ...(filter.$or || []),
        { name: regex },
        { email: regex },
        { mobile: regex },
        { _id: { $in: familyIdsFromMembers } },
      ];
    }

    // ✅ Fetch filtered families
    const families = await Family.find(filter)
      .populate("members")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Family.countDocuments(filter);

    res.json({ total, page, limit, data: families });
  } catch (error) {
    console.error("Error listing families:", error);
    res.status(500).json({ message: "Server error" });
  }
}; */


exports.familiesByVillage = async (req, res) => {
  try {
    let {  village } = req.query;
   
    const filter = {};

    // ✅ Filter by village if provided
    if (village) filter.village = village;

    // Step 4️⃣: Query Family collection
    const families = await Family.find(filter)
      .populate("members")
      .sort({ createdDate: -1 })
      .lean();

   

    res.json({  data: families });
  } catch (error) {
    console.error("Error listing families:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔍 Get Family by ID
exports.getFamily = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Extract ID

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Family ID" });
    }

    // Fetch family with members populated
    const family = await Family.findById(id).populate("members");
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    res.json(family);
  } catch (error) {
    console.error("Error getting family:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Update Family (head or basic info)
exports.updateFamily = async (req, res) => {
 /* try {
    const updated = await Family.findByIdAndUpdate(
      req.params.id,
      { ...req.body, modifiedUser: req.user._id },
      { new: true }
    ).populate("members");

    if (!updated) return res.status(404).json({ message: "Family not found" });
    res.json({ message: "Family updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating family:", error);
    res.status(500).json({ message: "Server error" });
  }*/

  try {
  //  const { memberId } = req.params; // memberId from URL
    const updateData = req.body;

    // Validate if member exists
    const family = await Family.findById( req.params.id,);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    let image = "";
    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/family",
      });

      image = uploadRes.url;
      family.image = image;
    }

    // Update all editable fields dynamically
    Object.keys(updateData).forEach((key) => {
      family[key] = updateData[key];
     // console.log( family[key],'-------------',updateData[key]);
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

// ❌ Delete Family (cascade deletes members)
exports.deleteFamily = async (req, res) => {
  try {
    const deleted = await Family.findOneAndDelete({ _id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Family not found" });

    res.json({ message: "Family and all members deleted successfully" });
  } catch (error) {
    console.error("Error deleting family:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔁 Reassign Family Head (head dies → promote member)
exports.reassignHead = async (req, res) => {
  try {
    const { familyId } = req.params;
    const { memberId } = req.body;

    const newHead = await FamilyMember.promoteToHead(familyId, memberId);
    res.json({ message: "Head reassigned successfully", data: newHead });
  } catch (error) {
    console.error("Error reassigning head:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// 👨‍👩 Add New Member to Family
exports.addMember = async (req, res) => {
  try {
    const { familyId } = req.params;
    const family = await Family.findById(familyId);
    if (!family) return res.status(404).json({ message: "Family not found" });

      // Generate member code
    const memberID = await generateMemberCode(familyId);

     // const image = req.file ? `/uploads/family/${req.file.filename}` : undefined;
     let image = "";
          if (req.file) {
            const uploadRes = await imagekit.upload({
              file: req.file.buffer,
              fileName: req.file.originalname,
              folder: "/advertise",
            });
      
            image = uploadRes.url;
          }

    const member = new FamilyMember({ ...req.body, familyId, memberID,image });
    await member.save();

    // Link to family
    family.members.push(member._id);
    await family.save();

    res.status(201).json({ message: "Member added successfully", data: member });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧹 Delete Member (without deleting family)
exports.deleteMember = async (req, res) => {
  try {
    console.log(req.params);
    const { familyId, memberId } = req.params;

    const deleted = await FamilyMember.findOneAndDelete({ _id: memberId, familyId });
    if (!deleted) return res.status(404).json({ message: "Member not found" });

    await Family.findByIdAndUpdate(familyId, { $pull: { members: memberId } });
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Server error" });
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

        console.log("Req body : " , updateData);



    // Validate if member exists
    const member = await FamilyMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    let image = "";
    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/family",
      });

      image = uploadRes.url;
      member.image = image;
    }



    // Update all editable fields dynamically
    Object.keys(updateData).forEach((key) => {
      member[key] = updateData[key];

      console.log(member[key]);
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

//router.get("/head-emails", async (req, res) => {
  exports.headEmails = async (req, res) => {
  try {
    const heads = await Family.find({ relation: "Head" }, "email -_id");
    
    // Extract and clean unique emails
    const emails = [
      ...new Set(
        heads
          .map((h) => h.email?.trim().toLowerCase())
          .filter((email) => email && email.includes("@"))
      ),
    ];

    console.log("Unique head emails:", emails);
    res.json(emails);
  } catch (err) {
    console.error("Error fetching head emails:", err);
    res.status(500).json({ message: "Error fetching head emails" });
  }
};

exports.genderStats = async (req, res) => {
  try {
    const stats = await Family.aggregate([
      {
        $lookup: {
          from: "familymembers",
          localField: "members",
          foreignField: "_id",
          as: "membersData"
        }
      },
      { $unwind: "$membersData" },
      {
        $group: {
          _id: "$membersData.gender",
          count: { $sum: 1 }
        }
      }
    ]);

    let male = 0, female = 0, other = 0;

    stats.forEach(s => {
      if (s._id === "Male") male = s.count;
      else if (s._id === "Female") female = s.count;
      else other = s.count;
    });

    res.json({ male, female, other });

  } catch (err) {
    res.status(500).json({
      message: "Failed to get gender stats",
      error: err.message
    });
  }
};


exports.villageStats = async (req, res) => {
  try {
    const Family = require("../models/Family");

    const data = await Family.aggregate([
      {
        $group: {
          _id: "$village",
          users: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(
      data.map(item => ({
        village: item._id || "Unknown",
        users: item.users
      }))
    );
  } catch (err) {
    res.status(500).json({
      message: "Failed to get village stats",
      error: err.message
    });
  }
};

exports.maritalAgeStats = async (req, res) => {
  try {
    const Family = require("../models/Family");

    // MUST POPULATE MEMBERS
    const families = await Family.find({})
      .select("members")
      .populate("members"); // <-- VERY IMPORTANT

    // Age buckets
    const groups = {
      "0-18": { married: 0, unmarried: 0 },
      "19-30": { married: 0, unmarried: 0 },
      "31-45": { married: 0, unmarried: 0 },
      "46-60": { married: 0, unmarried: 0 },
      "60+": { married: 0, unmarried: 0 }
    };

    const getAge = (dob) => {
      if (!dob) return 0;
      const birth = new Date(dob);
      const diff = Date.now() - birth.getTime();
      return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    };

    families.forEach(family => {
      family.members.forEach(member => {
        const age = getAge(member.birthDate);
        const isMarried = member.marital_status === "Married";

        let bucket = "";
        if (age <= 18) bucket = "0-18";
        else if (age <= 30) bucket = "19-30";
        else if (age <= 45) bucket = "31-45";
        else if (age <= 60) bucket = "46-60";
        else bucket = "60+";

        groups[bucket][isMarried ? "married" : "unmarried"]++;
      });
    });

    const result = Object.keys(groups).map(key => ({
      group: key,
      married: groups[key].married,
      unmarried: groups[key].unmarried
    }));

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({
      message: "Failed to calculate marital+age stats",
      error: err.message
    });
  }
};
