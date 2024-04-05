const express = require("express");
const carts = require("../controllers/cart.controller");

const router = express.Router();
router
    .route("/")
    .get(carts.findALL)
    .post(carts.addtocart)

router
    .route("/:user_id")
    .get(carts.getCart)
    .put(carts.update)

// Xóa sách trong giỏ
router
    .route("/:user_id/:book_id")
    .delete(carts.deleteBook);

// Xóa tất cả sách trong giỏ khi tiến hành mượn
router
    .route("/:user_id")
    .delete(carts.deleteAllBook);
module.exports = router;
