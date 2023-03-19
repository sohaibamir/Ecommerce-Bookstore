const express = require('express');
const router = express.Router();
const { userSignupValidator } = require('../validator');

const { signup, signin, signout, requireSignin } = require('../controller/auth');

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;