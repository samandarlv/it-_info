const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    if (req.method == "OPTIONS") {
        next();
    }
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res
                .status(403)
                .json({ message: "Author is not registered" });
        }
        // console.log(authorization);
        const bearer = authorization.split(" ")[0];
        const token = authorization.split(" ")[1];

        if (bearer != "Bearer" || !token) {
            return res.status(403).json({
                message: "Author is not registered,(token berilmagan) ",
            });
        }

        const decodedToken = jwt.verify(token, config.get("secret"));
        // console.log(decodedToken);

        next();
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .send({ message: "Author is not registered, (token noto'g'ri) " });
    }
};
