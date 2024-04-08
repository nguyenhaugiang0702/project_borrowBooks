const express = require("express");
const checkout = require("../controllers/checkout.controller");
const authenticateToken = require("../middelware/jwt");

const router = express.Router();

router.use(authenticateToken);

router
    .route("/")
    .get(checkout.findOne)
    .post(checkout.create)
    .delete(checkout.deleteALL);

router
    .route("/:id")
    .put(checkout.update)
    .delete(checkout.delete);

module.exports = router;
