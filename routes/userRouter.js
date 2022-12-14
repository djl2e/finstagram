const express = require('express');
const multer = require('multer');

const router = express.Router();

const userController = require('../controllers/userController');

// GET search
router.get('/search', userController.search);

// GET list
router.get('/list', userController.list);

// Get suggested users
router.get('/suggested', userController.suggested);

// GET profile
router.get('/profile', userController.profile, userController.user);

// POST update
router.post('/update', userController.update_post);

// POST image update
router.post('/password', userController.password_post);

// POST image update
router.post('/image', multer().fields([{ name: 'form-user-image' }]), userController.image_post);

// POST delete
router.post('/delete', userController.delete_post);

// GET another user
router.get('/:id', userController.user);

// GET mini user
router.get('/:id/mini', userController.mini_user);

// POST follow
router.post('/follow/:otherid', userController.follow_post);

// POST unfollow
router.post('/unfollow/:otherid', userController.unfollow_post);

module.exports = router;
