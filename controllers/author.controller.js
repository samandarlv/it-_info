// const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/error_handler");
const Author = require("../models/author");
// const { authorValidation } = require("../validations/author.validation");
const bcrypt = require("bcrypt");
const config = require("config");
const uuid = require("uuid");
const mailService = require("../services/MailService");

const myJwt = require("../services/JwtService");

// const generateAccessToken = (id, is_expert, authorRoles) => {
//     const payload = {
//         id,
//         is_expert,
//         authorRoles,
//     };
//     return jwt.sign(payload, config.get("secret"), { expiresIn: "1h" });
// };

const addAuthor = async (req, res) => {
    // try {
    // const { error, value } = authorValidation(req.body);
    // if (error) {
    //     return res.status(400).send({ message: error.details[0].message });
    // }

    const {
        author_first_name,
        author_last_name,
        author_nick_name,
        author_full_name,
        author_password,
        author_email,
        author_phone,
        author_info,
        author_position,
        author_photo,
        is_expert,
    } = req.body;

    const author = await Author.findOne({ author_email });
    if (author) {
        return res.status(400).send({ message: "Author exists" });
    }
    // const hashedPassword = bcrypt.hashSync(author_password, 7);

    const hashedPassword = await bcrypt.hash(author_password, 7);

    const author_activation_link = uuid.v4();

    const newAuthor = await Author({
        author_first_name,
        author_last_name,
        author_nick_name,
        author_full_name,
        author_password: hashedPassword,
        author_email,
        author_phone,
        author_info,
        author_position,
        author_photo,
        is_expert,
        author_activation_link,
    });
    await newAuthor.save();

    await mailService.sendActivationMail(
        author_email,
        `${config.get("api_Url")}/api/author/activate/${author_activation_link}`
    );

    const payload = {
        id: newAuthor._id,
        is_expert: newAuthor.is_expert,
        authorRoles: ["READ", "WRITE"],
        user_is_active: newAuthor.autorhor_is_active,
    };
    const tokens = myJwt.genereateTokens(payload);
    newAuthor.author_token = tokens.refreshToken;
    await newAuthor.save();

    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
    });

    res.status(200).send({ ...tokens, author: payload });
    // } catch (error) {
    // errorHandler(res, error);
    // }
};

const authorActivate = async (req, res) => {
    try {
        const author = await Author.findOne({
            author_activation_link: req.params.link,
        });
        if (!author) {
            return res.status(400).send({ message: "Bunday Avtor topilmadi" });
        }
        if (author.author_is_active) {
            return res.status(200).send({ message: "User already activated" });
        }
        author.author_is_active = true;
        await author.save();
        res.status(200).send({
            author_is_active: author.author_is_active,
            message: "User activated",
        });
    } catch (error) {
        errorHandler(res, error);
    }
};

const loginAuthor = async (req, res) => {
    try {
        const { author_email, author_password } = req.body;
        const author = await Author.findOne({ author_email });

        if (!author) {
            return res
                .status(400)
                .send({ message: "Email or password is incorrect" });
        }

        // const validPassword = bcrypt.compareSync(
        //     author_password, // ochiq password req.body dan olingan
        //     author.author_password // bazadagi hashlangan password
        // );

        const validPassword = await bcrypt.compare(
            author_password,
            author.author_password
        );

        if (!validPassword) {
            return res
                .status(400)
                .send({ message: "Email or password is incorrect" });
        }

        const payload = {
            id: author._id,
            is_expert: author.is_expert,
            authorRoles: ["READ", "WRITE"],
        };

        const tokens = myJwt.genereateTokens(payload);
        // console.log(tokens);

        author.author_token = tokens.refreshToken;
        await author.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            // httpOnly: true,
        });

        //uncaughtException
        // try {
        //     setTimeout(() => {
        //         var err = new Error("Hello");
        //         throw err;
        //     }, 1000);
        // } catch (error) {
        //     console.log(error);
        // }
        // //unhandledRejection
        // new Promise((_, reject) => reject(new Error("woops1")));

        res.status(200).send({ ...tokens });
    } catch (error) {
        errorHandler(res, error);
    }
};

const logoutAuthor = async (req, res) => {
    const { refreshToken } = req.cookies;
    let author;
    if (!refreshToken) {
        return res.status(400).send({ message: "Token topilmadi" });
    }
    author = await Author.findOneAndUpdate(
        { author_token: refreshToken },
        { author_token: "" },
        { new: true }
    );
    if (!author) return res.status(400).send({ message: "Token topilmadi" });
    res.clearCookie("refreshToken");
    res.status(200).send({ author });
};

const refreshAuthorToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(400).send({ message: "Token is not found" });
    }

    const authorDataFromCookie = await myJwt.verifyRefresh(refreshToken);
    const authorDataFromDb = await Author.findOne({
        author_token: refreshToken,
    });

    if (!authorDataFromCookie || !authorDataFromDb) {
        return res.status(400).send({ message: "Author is not registred" });
    }

    const author = await Author.findById(authorDataFromDb.id);
    if (!author) {
        return res.status(400).send({ message: "Author not found such id" });
    }

    const payload = {
        id: author._id,
        is_expert: author.is_expert,
        authorRoles: ["READ", "WRITE"],
    };

    const tokens = myJwt.genereateTokens(payload);
    author.author_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("refresh_ms"),
        // httpOnly: true,
    });

    res.status(200).send({ ...tokens });
};

const getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find({});
        if (authors.length < 1) {
            return res.status(400).send({ message: "Authors not found" });
        }
        res.json({ data: authors });
    } catch (error) {
        errorHandler(res, error);
    }
};

const deleteAuthor = async (req, res) => {
    try {
        const id = req.params.id;
        if (id != req.author.id) {
            return res.status(401).send({ message: "Sizda bunday huquq yo'q" });
        }
        const author = await Author.findById(id);
        if (!author) {
            return res
                .status(400)
                .send({ message: "Author not found such id" });
        }
        const deleted = await Author.deleteOne({ _id: id });
        if (!deleted.acknowledged) {
            return res.status(400).send({ message: "Author is not deleted" });
        }
        res.status(200).send({ message: "Author deleted" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        if (id != req.author.id) {
            return res.status(400).send({ message: "Sizda bunday huquq yo'q" });
        }
        const author = await Author.findOne({ _id: id });
        if (!author) {
            return res
                .status(400)
                .send({ message: "Author not found such id" });
        }

        const { author_name, parent_author_id } = req.body;

        if (parent_author_id) {
            const updated = await Author.updateOne(
                { _id: req.params.id },
                { $set: { author_name, parent_author_id } }
            );
        } else {
            const updated = await Author.updateOne(
                { _id: req.params.id },
                { $set: { author_name } }
            );
        }
        res.status(200).send({ message: "Author updated" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        if (id != req.author.id) {
            return res.status(400).send({ message: "Sizda bunday huquq yo'q" });
        }

        const author = await Author.findOne({ _id: id });
        if (!author) {
            return res
                .status(400)
                .send({ message: "Author not found such id" });
        }
        res.json(author);
    } catch (error) {
        errorHandler(res, error);
    }
};

const getAuthorByName = async (req, res) => {
    try {
        const { author_first_name } = req.params;
        const author = await Author.findOne({
            author_first_name: {
                $regex: req.params.author_first_name,
                $options: "i",
            },
        });
        if (!author) {
            return res.status(400).send({ message: "Author not found" });
        }
        res.json(author);
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    addAuthor,
    getAllAuthors,
    loginAuthor,
    deleteAuthor,
    updateAuthor,
    logoutAuthor,
    getAuthorById,
    getAuthorByName,
    refreshAuthorToken,
    authorActivate,
};
