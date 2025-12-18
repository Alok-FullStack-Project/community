const Event = require('../models/Event');
const EventImage = require('../models/EventImage');
const imagekit = require("../utils/imagekit");

/**
 * Create new Event
 * POST /api/event
 */
exports.createEvent = async (req, res) => {
  try {
    const { name, description, publish, coverImage,category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

     if (!category) return res.status(400).json({ message: 'Category required' });

     let image = "";
        if (req.file) {
          const uploadRes = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/advertise",
          });
    
          image = uploadRes.url;
        }
    
    

   //   const image = req.file ? `/uploads/events/${req.file.filename}` : undefined;

    const event = new Event({
      name: name.trim(),
      description: description || '',
      publish: publish !== undefined ? !!publish : true,
      category,            // ADD CATEGORY
      coverImage: image || '',
      createdUser: req.user?._id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('createEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * List Events (search + filter + pagination)
 * GET /api/event?q=&publish=&page=&limit=
 */
exports.listEvents = async (req, res) => {
  try {
    const { q, publish, page = 1, limit = 20 } = req.query;
    const filters = {};

    if (q) {
      const re = new RegExp(q, 'i');
      filters.$or = [{ name: re }, { description: re }];
    }

    if (publish !== undefined) filters.publish = publish === 'true';

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments(filters);
    const data = await Event.find(filters)
     .populate("category", "name type")
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
    console.error('listEvents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get single Event
 * GET /api/event/:id
 */
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdUser', 'name email')
      .populate('modifiedUser', 'name email')
      .lean();
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('getEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update Event
 * PUT /api/event/:id
 */
exports.updateEvent = async (req, res) => {
  try {
    const { name, description, publish, coverImage,category  } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (name !== undefined) event.name = String(name).trim();
    if (description !== undefined) event.description = description;
    if (publish !== undefined) event.publish = !!publish;
     if (category !== undefined) event.category = category;   // ADD
    //if (coverImage !== undefined) event.coverImage = coverImage;

    if (req.file) {
          const uploadRes = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/advertise",
          });
         // image = uploadRes.url;
        event.coverImage = uploadRes.url;
        }
    

    event.modifiedUser = req.user?._id;
    await event.save();

    res.json(event);
  } catch (err) {
    console.error('updateEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete Event (soft by default, hard with ?hard=true)
 * DELETE /api/event/:id
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const hard = req.query.hard === 'true';

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (hard) {
      await EventImage.deleteMany({ eventId: id }); // remove associated images
      await event.deleteOne();
      return res.json({ message: 'Event permanently deleted' });
    }

    event.publish = false;
    event.modifiedUser = req.user?._id;
    await event.save();
    res.json({ message: 'Event unpublished', event });
  } catch (err) {
    console.error('deleteEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add image to Event
 * POST /api/event/:id/image
 */
exports.addEventImage = async (req, res) => {
  try {
    const {
      caption,
      publish,
      showInSlider,
      showInGallery
    } = req.body;

    const eventId = req.params.id;

    // 🔍 Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    /* ================= IMAGE UPLOAD ================= */
    let image_url = "";

    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/event",
      });

      image_url = uploadRes.url;
    }

    /* ================= SAVE IMAGE ================= */
    const image = new EventImage({
      eventId,
      url: image_url,
      caption: caption || "",
      publish: publish !== undefined ? publish === "true" : true,

      // ⭐ NEW FLAGS
      showInSlider: showInSlider === "true",
      showInGallery: showInGallery !== "false", // default true

      createdUser: req.user?._id,
    });

    await image.save();

    res.status(201).json(image);

  } catch (err) {
    console.error("addEventImage error:", err);
    res.status(500).json({
      message: "Failed to upload event image",
      error: err.message,
    });
  }
};


/**
 * List Event images
 * GET /api/event/:id/images
 */
exports.listEventImages = async (req, res) => {
  try {
    const eventId = req.params.id;
    const images = await EventImage.find({ eventId })
      .sort({ createdDate: -1 })
      .populate('createdUser', 'name email')
      .populate('modifiedUser', 'name email');
    res.json(images);
  } catch (err) {
    console.error('listEventImages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listEventImagesGallery = async (req, res) => {
  try {
    const eventId = req.params.id;
    const images = await EventImage.find({ eventId,publish: true,
      showInGallery: true })
      .sort({ createdDate: -1 })
      .populate('createdUser', 'name email')
      .populate('modifiedUser', 'name email');
    res.json(images);
  } catch (err) {
    console.error('listEventImages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



/**
 * Update Event Image
 * PUT /api/event/image/:imageId
 */

exports.updateEventImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { caption, publish, showInSlider, showInGallery } = req.body;

    const image = await EventImage.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    /* ================= IMAGE REPLACE ================= */
    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/event",
      });

      image.url = uploadRes.url;
    }

    /* ================= UPDATE FIELDS ================= */
    if (caption !== undefined) image.caption = caption;
    if (publish !== undefined) image.publish = publish === "true" || publish === true;

    if (showInSlider !== undefined) {
      image.showInSlider = showInSlider === "true" || showInSlider === true;
    }

    if (showInGallery !== undefined) {
      image.showInGallery = showInGallery === "true" || showInGallery === true;
    }

    image.modifiedUser = req.user?._id;

    await image.save();

    res.json({
      message: "Image updated successfully",
      image,
    });

  } catch (err) {
    console.error("updateEventImage error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Delete Event Image
 * DELETE /api/event/image/:imageId
 */
exports.deleteEventImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await EventImage.findById(imageId);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    await image.deleteOne();
    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error('deleteEventImage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSliderImages = async (req, res) => {
  try {
    const images = await EventImage.find({
      publish: true,
      showInSlider: true
    })
    .sort({ createdDate: -1 })
    .select("url caption");

    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to load slider images" });
  }
};
