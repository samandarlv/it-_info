const Router = require("express");
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

router.post("/", addAdmin);
router.get("/", adminPolice, getAllAdmins);
router.put("/:id", adminActivePolice(), updateAdmin);
router.post("/login", loginAdmin);
router.delete("/:id", adminCreatorPolice(), deleteAdmin);

module.exports = router;
