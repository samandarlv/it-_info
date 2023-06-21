const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error_handler");
const { userValidation } = require("../validations/user.validations");
const User = require("../models/user");
const myJwt = require("../services/JwtService");
const config = require("config");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const mailService = require("../services/MailService");

exports.addUser = async (req, res) => {
    try {
        // const { error, value } = userValidation(req.body);
        // if (error) {
        //     return res.status(400).send({ message: error.details[0].message });
        // }
        const { user_name, user_email, user_password, user_info } = req.body;
        const user = await User.findOne({ user_email });
        if (user) {
            return res.status(400).send({ message: "User exists" });
        }

        const hashedPassword = await bcrypt.hash(user_password, 8);

        const user_activation_link = uuid.v4();

        const newUser = await User({
            user_name,
            user_email,
            user_password: hashedPassword,
            user_info,
        });
        await newUser.save();

        await mailService.sendActivationMail(
            user_email,
            `${config.get(
                "api_Url"
            )}/api/user/activate/${user_activation_link} `
        );

        const payload = {
            id: newUser._id,
            is_active: newUser.user_activation_link,
            userRoles: ["READ"],
        };

        const tokens = myJwt.genereateTokens(payload);
        newUser.user_token = tokens.refreshToken;
        await newUser.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
        });

        res.status(200).send({ ...tokens, message: "User added" });
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.userActivation = async (req, res) => {
    try {
        const user = await User.findOne({
            user_activation_link: req.param.link,
        });
        if (!user) {
            return res.status(400).send({ message: "Bunday User topilmadi" });
        }
        if (user.user_is_active) {
            return res.status(200).send({ message: "User alread activated" });
        }
        user.user_is_active = true;
        await user.save();
        res.status(200).send({});
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length < 1) {
            return res.status(400).send({ message: "Users not found" });
        }
        res.json(users);
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        // const { error, value } = userValidation(req.body);
        // if (error) {
        //     return res.status(400).send({ message: error.details[0].message });
        // }
        const {
            user_name,
            user_email,
            user_password,
            user_info,
            user_photo,
            user_is_active,
        } = req.body;
        const hashedPassword = await bcrypt.hash(user_password, 8);
        const updatedUser = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    user_name,
                    user_email,
                    user_password: hashedPassword,
                    user_info,
                    user_photo,
                    user_is_active,
                },
            }
        );
        if (updatedUser.acknowledged) {
            res.status(200).send({ message: "User updated" });
        } else {
            res.status(400).send({ message: "User is not updated" });
        }
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        const user = await User.findOne({ user_email });
        if (!user) {
            return res
                .status(400)
                .send({ message: "Email or password is incorrect" });
        }
        const validPassword = await bcrypt.compare(
            user_password,
            user.user_password
        );
        if (!validPassword) {
            return res
                .status(400)
                .send({ message: "Email or password is incorrect" });
        }

        const payload = {
            id: user._id,
            is_active: user.user_is_active,
        };

        const tokens = myJwt.genereateTokens(payload);

        user.user_token = tokens.refreshToken;
        await user.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
        });

        res.status(200).send({ message: "Welcome to system" });
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.logoutUser = async (req, res) => {
    const { refreshToken } = req.cookies;
    let user;
    if (!refreshToken) {
        return res.status(400).send({ message: "Token topilmadi" });
    }
    user = await User.findOneAndUpdate(
        { user_token: refreshToken },
        { user_token: "" },
        { new: true }
    );
    if (!user) return res.status(400).send({ message: "Token topilmadi" });
    res.clearCookie("refreshToken");
    res.status(200).send({ user });
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const deletedUser = await User.deleteOne({ _id: req.params.id });
        if (deletedUser.acknowledged) {
            res.status(200).send({ message: "User deleted" });
        } else {
            res.status(200).send({ message: "User is not deleted" });
        }
    } catch (error) {
        errorHandler(res, error);
    }
};
