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

module.exports = router;
