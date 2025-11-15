// controllers/advertiseController.js
const Advertise = require('../models/Advertise');
const imagekit = require("../utils/imagekit");

/**
 * Create new advertise
 * POST /api/advertise
 */
exports.createAdvertise = async (req, res) => {
  try {
 let image = "";
    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/advertise",
      });

      image = uploadRes.url;
    }


    const { name, startDate, endDate, publish } = req.body;
    //const image = req.file ? `/uploads/advertise/${req.file.filename}` : undefined;

    const advertise = new Advertise({
      name,
      startDate,
      endDate,
      publish: publish === 'true',
      image,
      createdUser: req.user._id
    });

    await advertise.save();
    res.status(201).json(advertise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * List advertises (search + filter + pagination)
 * GET /api/advertise?q=&publish=&page=&limit=
 */
exports.listAdvertises = async (req, res) => {
  try {
    const { q, publish, page = 1, limit = 20 } = req.query;
    const filters = {};

    if (q) {
      const re = new RegExp(q, 'i');
      filters.$or = [{ name: re }];
    }
    if (publish !== undefined) {
      filters.publish = publish === 'true';
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const total = await Advertise.countDocuments(filters);
    const data = await Advertise.find(filters)
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('createdUser', 'name email')
      .populate('modifiedUser', 'name email')
      .lean();

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data,
    });
  } catch (err) {
    console.error('listAdvertises error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get single advertise
 * GET /api/advertise/:id
 */
exports.getAdvertise = async (req, res) => {
  try {
    const advertise = await Advertise.findById(req.params.id)
      .populate('createdUser', 'name email')
      .populate('modifiedUser', 'name email')
      .lean();

    if (!advertise) return res.status(404).json({ message: 'Advertise not found' });
    res.json(advertise);
  } catch (err) {
    console.error('getAdvertise error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update advertise
 * PUT /api/advertise/:id
 */
exports.updateAdvertise = async (req, res) => {
  try {
    const advertise = await Advertise.findById(req.params.id);
    if (!advertise) return res.status(404).json({ message: 'Advertise not found' });

     //let image = "";
    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/advertise",
      });

     // image = uploadRes.url;
     advertise.image = uploadRes.url;
    }

    const { name, startDate, endDate, publish } = req.body;
    if (name) advertise.name = name;
    if (startDate) advertise.startDate = startDate;
    if (endDate) advertise.endDate = endDate;
    if (publish !== undefined) advertise.publish = publish === 'true';
   //if (req.file) advertise.image = `/uploads/advertise/${req.file.filename}`;
    advertise.modifiedUser = req.user._id;

    await advertise.save();
    res.json(advertise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete advertise (soft or hard)
 * DELETE /api/advertise/:id?hard=true
 */
exports.deleteAdvertise = async (req, res) => {
  try {
    const { id } = req.params;
    const hard = req.query.hard === 'true';

    const advert = await Advertise.findById(id);
    if (!advert) return res.status(404).json({ message: 'Advertise not found' });

    if (hard) {
      await advert.deleteOne();
      return res.json({ message: 'Advertise permanently deleted' });
    }

    advert.publish = false;
    advert.modifiedUser = req.user?._id;
    await advert.save();
    res.json({ message: 'Advertise unpublished (soft delete)', advertise: advert });
  } catch (err) {
    console.error('deleteAdvertise error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
