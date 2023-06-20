const Joi = require("joi");

const adminEmailPassSchema = Joi.object({
    admin_email: Joi.string().email().message("Invalid email").required(),
    admin_password: Joi.string().min(8).required(),
});

module.exports = adminEmailPassSchema;
