const { Router } = require("express");
const express = require("express");
const router = Router();

const descRouter = require("./description.routes");
const categoryRouter = require("./category.routes");
const adminRouter = require("./admin.routes");
const authorRouter = require("./author.routes");
const userRouter = require("./user.routes");
const dictionaryRouter = require("./dictionary.routes");

express.Router.prefix = function (path, subRouter) {
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
};

router.prefix("/api", (apiRouter) => {
    apiRouter.use("/category", categoryRouter);
    apiRouter.use("/term", dictionaryRouter);
    apiRouter.use("/description", descRouter);
    apiRouter.use("/author", authorRouter);
    apiRouter.use("/admin", adminRouter);
    apiRouter.use("/user", userRouter);
});

module.exports = router;
