"use strict";

const express = require("express");

const app = express();

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');


app.get("/", function (req, res, next) {
    res.render("home");
});

app.get("/all_books", function (req, res, next) {
    res.render("all_books");
});


app.listen(3000, function () {
    console.log("The frontend server is running on port 3000!");
});
