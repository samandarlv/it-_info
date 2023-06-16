const { Router } = require("express");
const router = Router();
const {
    addCategory,
    getAllCatergories,
    deleteCategory,
    updateCategory,
    getCategoryById,
    getCategoryByName,
} = require("../controllers/category.controller");
const adminActivePolice = require("../middleware/adminActivePolice");

router.get("/", getAllCatergories);
router.get("/:id", adminActivePolice(), getCategoryById);
router.get("/category/:category_name", getCategoryByName);
router.post("/", adminActivePolice(), addCategory);
router.delete("/:id", adminActivePolice(), deleteCategory);
router.put("/:id", adminActivePolice(), updateCategory);

module.exports = router;
