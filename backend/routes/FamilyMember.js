const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
//const memberController = require("../controllers/familyMemberController");
const auth = require('../middleware/auth'); // if authentication required

// 📋 List all members (for admin)
//router.get("/", auth, memberController.listMembers);

// ✏️ Update member
//router.put("/:id", auth, upload.single("image"), memberController.updateMember);

module.exports = router;
