const express = require("express");
const books = require("../controllers/book.controller");

const router = express.Router();
router
    .route("/")
    .get(books.findALL)
    .post(books.create)
    .delete(books.deleteALL);

router
    .route("/search")
    .get(books.search)

router
    .route("/productsHome")
    .get(books.productsHome)
router
    .route("/filterPublishers/:id")
    .get(books.filterBooksWithPublisher)

router
    .route("/publisher/:id")
    .get(books.findBookWithPublisherID)

router
    .route("/checkNumber")
    .post(books.checkNumberBook)

router
    .route("/:id")
    .get(books.findOne)
    .put(books.update)
    .delete(books.delete);

module.exports = router;
