const Category = require("../models/Category");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, type, description, order } = req.body;

    console.log(req.body);

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const cat = new Category({
      name,
      type,
      description: description || "",
      order: order || 0,
      createdUser: req.user._id
    });

    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    console.error("createCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List Categories (filter + sort by displayOrder > name)
exports.listCategories = async (req, res) => {
  try {
    const { type } = req.query;

    const filters = {};
    if (type) filters.type = type;

    const categories = await Category.find(filters)
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    res.json(categories);
  } catch (err) {
    console.error("listCategories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Category by ID
exports.getCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id).lean();
    if (!cat) return res.status(404).json({ message: "Category not found" });

    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { name, type, description, order } = req.body;

    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    if (name) cat.name = name;
    if (type) cat.type = type;
    if (description !== undefined) cat.description = description;
    if (order !== undefined) cat.order = order;

    cat.modifiedUser = req.user._id;

    await cat.save();
    res.json(cat);
  } catch (err) {
    console.error("updateCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
