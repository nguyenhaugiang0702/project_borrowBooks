const express = require("express");
const carts = require("../controllers/cart.controller");
const authenticateToken = require("../middelware/jwt");

const router = express.Router();

router.use(authenticateToken);

router
    .route("/")
    .get(carts.getCart)
    .post(carts.addtocart)

// router
//     .route("/:user_id")
//     .get(carts.getCart)
//     .put(carts.update)

// Xóa tất cả sách trong giỏ khi tiến hành mượn
router
    .route("/deleteAll")
    .delete(carts.deleteAllBook);
    
// Xóa sách trong giỏ
router
    .route("/:book_id")
    .delete(carts.deleteBook);



module.exports = router;
