const author = require("./author.validator");
const author_email_pass = require("./author_email_pass.validator");
const category = require("./category.validator");
const admin = require("./admin.validator");
const user = require("./user.validator");
const admin_email_pass = require("./admin_email_pass.validator");
const user_email_pass = require("./user_email_pass.validator");
const topic = require("./topic.validator");

module.exports = {
    author_email_pass,
    author,
    category,
    admin,
    user,
    admin_email_pass,
    user_email_pass,
    topic,
};
