const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/users')
    .then(() => {
        console.log(`connection successful`);
    }).catch((e) => {
        console.log(`no connection`);
        console.log(e);
    })