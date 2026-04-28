const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Create post
router.post('/', protect, async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      content: req.body.content,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete post
router.delete('/:id', protect, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;