const { Router } = require("express");
const router = Router();

const {
    addAuthor,
    getAllAuthors,
    deleteAuthor,
    updateAuthor,
    getAuthorById,
    getAuthorByName,
    loginAuthor,
    logoutAuthor,
    refreshAuthorToken,
    authorActivate,
} = require("../controllers/author.controller");
const Validator = require("../middleware/validator");

const authorPolice = require("../middleware/authorPolice");
const authorRolesPolice = require("../middleware/authorRolesPolice");

router.post("/", Validator("author"), addAuthor);
router.get("/", authorPolice, getAllAuthors);
router.get(
    "/:id",
    authorRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
    getAuthorById
);
router.get("/author/:author_first_name", getAuthorByName);
router.delete("/:id", deleteAuthor);
router.post("/login", Validator("author_email_pass"), loginAuthor);
router.post("/logout", logoutAuthor);
router.put("/:id", Validator("author"), updateAuthor);
// router.post("/refresh", refreshAuthorToken);
router.get("/activate/:link", authorActivate);

module.exports = router;
