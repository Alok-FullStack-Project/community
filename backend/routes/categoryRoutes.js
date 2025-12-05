const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../middleware/auth");

router.post("/", auth, categoryController.createCategory);
router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);
router.put("/:id", auth, categoryController.updateCategory);
router.delete("/:id", auth, categoryController.deleteCategory);

module.exports = router;
