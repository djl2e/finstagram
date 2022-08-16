const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// GET search
router.get('/search', userController.search);

// GET profile
router.get('/profile', userController.profile, userController.user);

// POST update
router.post('/update', userController.update_post);

// POST image update
router.post('/password', userController.password_post);

// POST image update
router.post('/image', userController.image_post);

// POST delete
router.post('/delete', userController.delete_post);

// GET another user
router.get('/:id', userController.user);

// POST follow
router.post('/follow/:otherid', userController.follow_post);

// POST unfollow
router.post('/unfollow/:otherid', userController.unfollow_post);

module.exports = router;
