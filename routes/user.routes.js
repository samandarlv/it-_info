const { Router } = require("express");
const Validator = require("../middleware/validator");

const {
    addUser,
    getAllUsers,
    updateUser,
    loginUser,
    deleteUser,
    userActivation,
} = require("../controllers/user.controller");
const router = Router();

router.post("/", Validator("user"), addUser);
router.get("/", getAllUsers);
router.put("/:id", Validator("user"), updateUser);
router.post("/login", Validator("user_email_pass"), loginUser);
router.delete("/:id", deleteUser);
router.get("/activate/:link", userActivation);

module.exports = router;
