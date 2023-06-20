const Router = require("express");
const Validator = require("../middleware/validator");

const {
    addAdmin,
    getAllAdmins,
    updateAdmin,
    loginAdmin,
    deleteAdmin,
} = require("../controllers/admin.controller");
const adminPolice = require("../middleware/adminPolice");
const adminActivePolice = require("../middleware/adminActivePolice");
const adminCreatorPolice = require("../middleware/adminCreatorPolice");
const router = Router();

router.post("/", Validator("admin"), addAdmin);
router.get("/", adminPolice, getAllAdmins);
router.put("/:id", adminActivePolice(), Validator("admin"), updateAdmin);
router.post("/login", Validator("admin_email_pass"), loginAdmin);
router.delete("/:id", adminCreatorPolice(), deleteAdmin);

module.exports = router;
