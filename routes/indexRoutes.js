const express = require('express');
const { blogStats, blogSearch } = require('../controllers/blog');

const router = express.Router();

// Get /api/blog-stats
router.route('/blog-stats').get(blogStats);

// Get /api/blog-search
router.route('/blog-search').get(blogSearch);

module.exports = router;
