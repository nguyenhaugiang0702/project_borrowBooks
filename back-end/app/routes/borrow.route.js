const express = require("express");
const borrow = require("../controllers/borrow.controller");
const authenticateToken = require("../middelware/jwt");

const router = express.Router();

router
    .route("/")
    .get(borrow.findALL)
    .post(authenticateToken, borrow.addtoTrackBookBorrowing)

// Lấy tất cả các đơn mượn từ user_id
router
    .route("/user")
    .get(authenticateToken, borrow.getBorrowWithUserId)

// Cập nhật số lượng sách trả
router
    .route("/updateReturnNumber/:id")
    .put(borrow.updateReturnBookNumber)

// Lấy thông tin đơn mượn với id đơn mượn
router
    .route("/:id")
    .get(borrow.getBorrowWithID)

// Xóa đơn mượn với id đơn mượn
router
    .route("/borrowWithId/:id")
    .delete(borrow.deleteBorrowWithId)

// Cập nhật trạng thái đơn mượn và số lượng sách mượn trong collection 'books'
router
    .route("/:id")
    .put(borrow.updateStatus)

module.exports = router;
