const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Users = require("../models/users");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await Users.findOne({ _id: verifyUser });

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;