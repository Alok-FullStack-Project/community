const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const familyController = require("../controllers/familyController");
const auth = require('../middleware/auth'); // if authentication required

// =============================
// 🏡 FAMILY ROUTES
// =============================

// ➕ Create new family (with optional members)
router.post(
  "/",
  auth,
  upload.single("image"), // optional family image
  familyController.createFamily
);

// 📋 Get all families (with pagination, search, village filter)
router.get("/",  auth,familyController.listFamilies); //auth,

router.get('/head-emails', auth, familyController.headEmails);

// --- COUNT FAMILIES ---
router.get("/count", auth, async (req, res) => {
  try {
    const Family = require("../models/Family");
     const FamilyMember = require("../models/FamilyMember");
    const familyCount = await Family.countDocuments();
    const memberCount = await FamilyMember.countDocuments();
    res.status(200).json({ familyCount,memberCount });
  } catch (err) {
    console.log("❌ Count Error:", err.message);
    res.status(500).json({
      message: "Failed to count families",
      error: err.message
    });
  }
});

router.get("/family_memeber_count", auth, async (req, res) => {
  try {
    const Family = require("../models/Family");
    const count = await Family.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.log("❌ Count Error:", err.message);
    res.status(500).json({
      message: "Failed to count families",
      error: err.message
    });
  }
});

// 1️⃣ Gender statistics
router.get("/stats/gender", auth, familyController.genderStats);

// 2️⃣ Village-wise family count
router.get("/stats/village", auth, familyController.villageStats);

// 3️⃣ Marital status + Age groups
router.get("/stats/marital-age", auth, familyController.maritalAgeStats);
// 🔍 Get family by ID (includes members)
router.get("/:id", auth, familyController.getFamily);

// ✏️ Update family info (head or other details)
router.put(
  "/:id",
  auth,
  upload.single("image"),
  familyController.updateFamily
);

// ❌ Delete family (auto deletes all members)
router.delete("/:id", auth, familyController.deleteFamily);

// 🔁 Reassign head when old head is deleted/dies
router.put("/:familyId/reassign-head", auth, familyController.reassignHead);

// =============================
// 👨‍👩 FAMILY MEMBERS ROUTES
// =============================

// ➕ Add new member to a family
router.post(
  "/:familyId/members",
  auth,
  upload.single("image"),
  familyController.addMember
);

// ❌ Delete a member from a family
router.delete(
  "/:familyId/member/:memberId",
  auth,
  familyController.deleteMember
);

router.get('/member/:memberId', auth, familyController.getMember);
router.put('/member/:memberId', auth,upload.single("image"), familyController.updateMember);


module.exports = router;
