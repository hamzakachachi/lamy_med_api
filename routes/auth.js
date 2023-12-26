'use strict';

const express = require("express");
const { auth, logout, verifyToken } = require(__dirname +"/../controller/authController");
const router = express.Router();
router.post("/login", auth);
router.post("/logout", logout);
router.post("/verify", (req, res) => {
    verifyToken(req, res)
});

module.exports = router;