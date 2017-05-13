"use strict";

const express = require("express");
const Patron = require("./models").patrons;
const sequelize = require("./models").sequelize;

const books = require("./routes/books.js")
const loans = require("./routes/loans.js")
const patrons = require("./routes/patrons.js")

const app = express();

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

app.get("/", function (req, res, next) {
    res.render("home");
});

app.use("/all_books", books);
app.use("/all_loans", loans);
app.use("/all_patrons", patrons);

sequelize.sync().then(function () {
    app.listen(3000, function () {
        console.log("The frontend server is running on port 3000!");
    });
});
