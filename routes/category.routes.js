const { Router } = require("express");
const router = Router();
const Validator = require("../middleware/validator");

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
router.post("/", adminActivePolice(), Validator("category"), addCategory);
router.delete("/:id", adminActivePolice(), deleteCategory);
router.put("/:id", adminActivePolice(), Validator("category"), updateCategory);

module.exports = router;
