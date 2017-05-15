const express = require("express"),
      Book = require("../db.js").books,
      Loan = require("../db.js").loans,
      Patron = require("../db.js").patrons;

const router = express.Router();

router.get("/", function (req, res, next) {

    if (req.query.filter === "overdue") {

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
        }).then(renderBooksFromLoans);

    } else if (req.query.filter === "checked_out") {

        Loan.findAll({
            where: {
                returned_on: null
            },
            include: [
                {
                    model: Book
                }
            ]
        }).then(renderBooksFromLoans);

    } else {

        Book.findAll().then(function (books) {
            res.render("books", {
                books: books
            });
        });

    }


    function renderBooksFromLoans(loans) {
        const books = [];
        for (let loan of loans) {
            books.push(loan.book);
        }

        res.render("books", {
            books: books
        });
    }
});

router.get("/detail/:id", function (req, res, next) {

    getBookDetails(req.params.id).then(function (book, loans) {
        res.render("book_detail", {
            book: book,
            loans: loans
        });
    });
});

router.post("/detail/:id", function (req, res, next) {
    Book.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(function (book) {
        res.redirect("/books");

    }).catch(function (err) {

        if (err.name === "SequelizeValidationError") {

            getBookDetails(req.params.id).then(function(book, loans) {
                res.render("book_detail", {
                    book: Book.build(req.body),
                    loans: loans,
                    errors: err.errors
                });
            });

        } else {
            throw err;
        }
    });
});

router.get("/new_book", function (req, res, next) {
    res.render("new_book", {
        book: {}
    });
});

router.post("/new_book", function (req, res, next) {
    Book.create(req.body).then(function (book) {
        res.redirect("/books")
    }).catch(function (err) {
        if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
            res.render("new_book", {
                book: Book.build(req.body),
                errors: err.errors
            });
        } else {
            throw err;
        }
    });
});


function getBookDetails(bookId) {
    return {
        then: function (callback) {
            Book.findById(bookId).then(function (book) {
                Loan.findAll({
                    where: {
                        book_id: bookId
                    },
                    include: [
                        {
                            model: Book
                            },
                        {
                            model: Patron
                            }
                    ]
                }).then(function (loans) {
                    callback(book, loans);
                });
            });
        }
    }
}

module.exports = router;
