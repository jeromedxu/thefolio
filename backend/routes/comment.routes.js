const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Add comment
router.post('/:postId', protect, async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      user: req.user._id,
      text: req.body.text,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;