const express = require('express');

const router = express.Router();

const commentController = require('../controllers/commentController');

// POST create
router.post('/:id', commentController.create_post);

// POST update
router.post('/:id', commentController.update_post);

// POST delete
router.post('/:id', commentController.delete_post);

module.exports = router;
