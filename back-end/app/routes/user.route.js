const express = require("express");
const users = require("../controllers/user.controller");
const authenticateToken = require("../middelware/jwt");

const router = express.Router();
router
    .route("/getOneUser")
    .get(authenticateToken, users.findOne);
    
router
    .route("/updateOneUser")
    .put(authenticateToken, users.update);
    
router
    .route("/")
    .get(users.findALL)
    .post(users.create)
    .delete(users.deleteALL);


router
    .route("/login")
    .post(users.loginUser);

router
    .route("/:id")
    .delete(users.delete);

module.exports = router;
