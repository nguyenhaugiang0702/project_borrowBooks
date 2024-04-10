const express = require("express");
const borrow = require("../controllers/borrow.controller");
const authenticateToken = require("../middelware/jwt");

const router = express.Router();

router
    .route("/")
    .get(borrow.findALL)
    .post(authenticateToken.authenticateTokenFromHeader, borrow.addtoTrackBookBorrowing)

// Lấy tất cả các đơn mượn từ user_id
router
    .route("/:token")
    .get(authenticateToken.authenticateTokenFromParams, borrow.getBorrowWithUserId)

// Cập nhật số lượng sách trả (Admin)
router
    .route("/updateReturnNumber/:id")
    .put(borrow.updateReturnBookNumber)

// Cập nhật trạng thái đơn mượn và số lượng sách mượn trong collection 'books' (admin)
router
    .route("/:borrowId")
    .put(authenticateToken.authenticateTokenFromHeader, borrow.updateStatus)
    .delete(borrow.deleteBorrowWithId)

module.exports = router;
