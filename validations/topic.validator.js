const Joi = require("joi");

const topicSchema = Joi.object({
    author_id: Joi.string().required(),
    topice_title: Joi.string().required(),
    topic_text: Joi.string().required(),
    is_checked: Joi.boolean().default(true),
    is_approved: Joi.boolean().default(true),
    expert_id: Joi.ref("author_id"),
});

module.exports = topicSchema;
