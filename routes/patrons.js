const express = require("express");
const Patron = require("../db.js").patrons;

const router = express.Router();

router.get("/", function (req, res, next) {
    Patron.findAll().then(function (patrons) {
        res.render("patrons", {
            patrons: patrons
        });
    });
});

router.get("/new_patron", function (req, res, next) {
    res.render("new_patron");
});

router.post("/new_patron", function (req, res, next) {
    Patron.create(req.body).then(function (patron) {
        res.redirect("/patrons");
    });
});

module.exports = router;
