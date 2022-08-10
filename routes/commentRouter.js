const express = require('express');

const router = express.Router();

const commentController = require('../controllers/commentController');

// POST create
router.post('/create', commentController.create_post);

// POST update
router.post('/:id/update', commentController.update_post);

// POST delete
router.post('/:id/delete', commentController.delete_post);

module.exports = router;
