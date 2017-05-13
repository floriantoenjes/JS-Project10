const express = require("express");
const Book = require("../db.js").books;
const Loan = require("../db.js").loans;

const router = express.Router();

router.get("/", function (req, res, next) {
    if (req.query.filter === "overdue") {
        const books = [];

        Loan.findAll({
            where: {
                return_by: {
                    $lt: Date()
                },
                returned_on: null
            },
            include: [
                {
                    model: Book
                }
            ]
        }).then(function (results) {
            for (let result of results) {
                books.push(result.book);
            }

            console.log(books);
            res.render("all_books", {books:books});
        });

    } else if (req.query.filter === "checked_out") {
        const books = [];

        Loan.findAll({
            where: {
                returned_on: null
            }
        }).then(function (loans) {
            const promises = [];

            for (let loan of loans) {
                promises.push(new Promise(function (resolve, reject) {
                    Book.findOne({
                        where: {
                            id: loan.book_id
                        }
                    }).then(function (book) {
                        books.push(book);
                        resolve(true);
                    });
                }));
            }

            Promise.all(promises).then(function () {
                res.render("all_books", {
                    books: books
                });
            })
        });

    } else {

        Book.findAll().then(function (books) {
            res.render("all_books", {
                books: books
            });
        });

    }
});

module.exports = router;
