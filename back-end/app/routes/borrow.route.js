const express = require("express");
const borrow = require("../controllers/borrow.controller");

const router = express.Router();
router
    .route("/")
    .get(borrow.findALL)
    .post(borrow.addtoTrackBookBorrowing)
router
    .route("/")
    .post(borrow.addtoTrackBookBorrowing)
router
    .route("/updateReturnNumber/:id")
    .put(borrow.updateReturnBookNumber)

router
    .route("/:id")
    .get(borrow.getBorrowWithID)

router
    .route("/users/:user_id")
    .get(borrow.getBorrowWithUserId)

router
    .route("/:user_id")
    .delete(borrow.deleteAllBook)

router
    .route("/borrowWithId/:id")
    .delete(borrow.deleteBorrowWithId)

router
    .route("/:id")
    .put(borrow.updateStatus)

module.exports = router;
