const express = require('express');

const router = express.Router();

const postController = require('../controllers/postController');

// POST create
router.post('/create', postController.create_post);

// POST update
router.post('/:id/update', postController.update_post);

// POST delete
router.post('/:id/delete', postController.delete_post);

// GET single post
router.get('/:id', postController.post_get);

// POST like
router.post('/:id/like', postController.like);

// POST unlike
router.post('/:id/unlike', postController.unlike);

module.exports = router;
