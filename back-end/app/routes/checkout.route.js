const express = require("express");
const checkout = require("../controllers/checkout.controller");

const router = express.Router();
router
    .route("/")
    .get(checkout.findALL)
    .post(checkout.create)
    .delete(checkout.deleteALL);

router
    .route("/:id")
    .get(checkout.findOne)
    .put(checkout.update)
    .delete(checkout.delete);

module.exports = router;
