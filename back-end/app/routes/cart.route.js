const express = require("express");
const carts = require("../controllers/cart.controller");

const router = express.Router();
router
    .route("/")
    .get(carts.findALL)
    .post(carts.addtocart)

router
    .route("/:id")
    .get(carts.getCart)
    .put(carts.update)

router
    .route("/:user_id/:book_id")
    .delete(carts.deleteBook);

router
    .route("/:user_id")
    .delete(carts.deleteAllBook);
module.exports = router;
