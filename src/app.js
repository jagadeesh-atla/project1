const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");
const Users = require("./models/users");
const { execPath } = require("process");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index");
});

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

       const regUser =  await newUser.save();
        res.status(201).render("index");

    } catch (error) {
        res.status(400).send(error);
    }
} );

app.get("/login", (req, res) => {
    res.render("login");
});

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});
