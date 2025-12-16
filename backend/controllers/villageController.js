// controllers/villageController.js
const Village = require('../models/Village');

/**
 * Create a new village
 * POST /api/village
 */
exports.createVillage = async (req, res) => {
  try {
    const { name, publish = true } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Village name is required' });
    }

    const village = new Village({
      name: name.trim(),
      publish: publish === undefined ? true : !!publish,
      createdUser: req.user?._id, // ensure auth middleware is present
    });

    await village.save();
    res.status(201).json(village);
  } catch (err) {
    console.error('createVillage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * List villages (supports search & pagination)
 * GET /api/village
 * Query params: q (search by name), page, limit, publish (true/false)
 */
exports.listVillages = async (req, res) => {
  try {
    const user = req.user; // logged-in user from auth middleware

    // ----------------------------------------
    // 1️⃣ REPRESENTATIVE → return assigned villages ONLY
    // ----------------------------------------
    if (user?.role === "representative") {
      const assignedVillages = user.nativePlaces || [];
       let villages = [];
      villages = await Village.find({
        
      }); //name : { $in: user.nativePlaces }
     
      return res.json({
        total: villages.length,
        page: 1,
        limit: villages.length,
        totalPages: 1,
        data: villages,
      });
    }

    // ----------------------------------------
    // 2️⃣ ADMIN / MANAGER → normal flow (search, pagination)
    // ----------------------------------------
    const { q, page = 1, limit = 20, publish } = req.query;

    const filters = {};
    if (q) filters.name = new RegExp(q, "i");

    if (publish !== undefined) {
      filters.publish = publish === "true";
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const total = await Village.countDocuments(filters);

    const villages = await Village.find(filters)
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: villages,
    });
  } catch (err) {
    console.error("listVillages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Get single village by id
 * GET /api/village/:id
 */
exports.getVillage = async (req, res) => {
  try {
    const { id } = req.params;
  const village = await Village.findById(id).lean();
 
    if (!village) return res.status(404).json({ message: 'Village not found' });
    res.json(village);
  } catch (err) {
    console.error('getVillage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a village
 * PUT /api/village/:id
 */
exports.updateVillage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, publish } = req.body;

    const village = await Village.findById(id);
    if (!village) return res.status(404).json({ message: 'Village not found' });

    if (name !== undefined) village.name = String(name).trim();
    if (publish !== undefined) village.publish = !!publish;

    // set modified user if available
    if (req.user && req.user._id) village.modifiedUser = req.user._id;

    await village.save();
    res.json(village);
  } catch (err) {
    console.error('updateVillage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a village
 * DELETE /api/village/:id
 * Query param: hard=true to hard-delete, otherwise it will soft-unpublish (publish=false)
 */
exports.deleteVillage = async (req, res) => {
  try {
    const { id } = req.params;
    const hard = req.query.hard === 'true';

    const village = await Village.findById(id);
    if (!village) return res.status(404).json({ message: 'Village not found' });

    if (hard) {
      await village.deleteOne();
      return res.json({ message: 'Village permanently deleted' });
    }

    // soft delete: unpublish and set modifiedUser
    village.publish = false;
    if (req.user && req.user._id) village.modifiedUser = req.user._id;
    await village.save();
    res.json({ message: 'Village unpublished (soft deleted)', village });
  } catch (err) {
    console.error('deleteVillage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
