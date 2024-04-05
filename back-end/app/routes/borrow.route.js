const express = require("express");
const borrow = require("../controllers/borrow.controller");

const router = express.Router();
router
    .route("/")
    .get(borrow.findALL)
    .post(borrow.addtoTrackBookBorrowing)

// Cập nhật số lượng sách trả
router 
    .route("/updateReturnNumber/:id")
    .put(borrow.updateReturnBookNumber)

// Lấy thông tin đơn mượn với id đơn mượn
router
    .route("/:id")
    .get(borrow.getBorrowWithID)

// Lấy tất cả các đơn mượn từ user_id
router
    .route("/users/:user_id")
    .get(borrow.getBorrowWithUserId)

// Xóa đơn mượn với id đơn mượn
router
    .route("/borrowWithId/:id")
    .delete(borrow.deleteBorrowWithId)

// Cập nhật trạng thái đơn mượn và số lượng sách mượn trong collection 'books'
router
    .route("/:id")
    .put(borrow.updateStatus)

module.exports = router;
