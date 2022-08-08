const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

// POST signup
router.post('/signup', authController.signup_post);

// POST login
router.post('/login', authController.login_post);

module.exports = router;
