const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// POST signup
router.post('/signup', userController.signup_post);

// POST login
router.post('/login', userController.login_post);

// GET search
router.get('/search', userController.search);

// GET user
router.get('/:id', userController.user);

// GET update
router.get('/:id/update', userController.update_get);

// POST update
router.post('/:id/update', userController.update_post);

// POST delete
router.post('/:id/delete', userController.delete_post);

// POST follow
router.post('/:id/follow/:otherid', userController.follow_post);

// POST unfollow
router.post('/:id/unfollow/:otherid', userController.unfollow_post);

module.exports = router;
