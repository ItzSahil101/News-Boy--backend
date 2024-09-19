const express = require("express");
const router = express.Router();

const {createUser, LoginUser} = require('../controllers/authController');

router.post("/", createUser)

router.post("/login", LoginUser)

module.exports = router;