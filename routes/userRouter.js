const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// GET search
router.get('/search', userController.search);

// GET update
router.get('/update', userController.update_get);

// POST update
router.post('/update', userController.update_post);

// POST delete
router.post('/delete', userController.delete_post);

// GET user
router.get('/:id', userController.user);

// POST follow
router.post('/follow/:otherid', userController.follow_post);

// POST unfollow
router.post('/unfollow/:otherid', userController.unfollow_post);

module.exports = router;
