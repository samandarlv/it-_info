const Router = require("express");
const Validator = require("../middleware/validator");
const { getTopics, addTopic } = require("../controllers/topic.controller");

const router = Router();

router.get("/", getTopics);
router.post("/", Validator("topic"), addTopic);

module.exports = router;
