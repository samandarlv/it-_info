const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
    {
        author_id: {
            type: Schema.Types.ObjectId,
            ref: "Author",
            reqired: true,
        },
        topice_title: {
            type: String,
            reqired: true,
        },
        topic_text: {
            type: String,
            reqired: true,
        },
        is_checked: {
            type: Boolean,
        },
        is_approved: {
            type: Boolean,
        },
        expert_id: {
            type: Schema.Types.ObjectId,
            ref: "Author",
        },
    },
    {
        versionKey: false,
    }
);

module.exports = model("Topic", topicSchema);
