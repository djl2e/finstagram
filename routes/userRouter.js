const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// POST signup
router.post('/signup', userController.signup_post);

// POST login
router.post('/login', userController.login_post);

module.exports = router;
