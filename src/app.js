require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Users = require("./models/users");
const { execPath } = require("process");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/secret", auth, (req, res) => {
    res.render("secret");
})

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const newUser = new Users({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })

        const token = await newUser.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true,
            // secure:true
        });

        const regUser = await newUser.save();
        res.status(201).render("index");
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const user = req.body.username;
        const pass = req.body.password;

        const user1 = await Users.findOne({ username: user });
        const isMatch = await bcrypt.compare(pass, user1.password);

        const token = await user1.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true,
            // secure:true
        });

        const cookieParsered = await req.cookies.jwt;

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send("Invalid Login");
        }
    } catch (error) {
        res.status(400).send("Invalid Login 5");
    }
});

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});
