const { errorHandler } = require("../helpers/error_handler");
const Topic = require("../models/topic");

exports.getTopics = async (req, res) => {
    try {
        const topics = await Topic.find({});
        if (topics.length < 1) {
            return res.status(400).send({ message: "Topics not found" });
        }
        res.json({ data: topics });
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.addTopic = async (req, res) => {
    try {
        const {
            author_id,
            topice_title,
            topic_text,
            is_checked,
            is_approved,
            expert_id,
        } = req.body;
        const newtopic = await Topic({
            author_id,
            topice_title,
            topic_text,
            is_checked,
            is_approved,
            expert_id,
        });
        await newtopic.save();
        res.status(200).send({ message: "Topic added" });
    } catch (error) {
        errorHandler(res, error);
    }
};
