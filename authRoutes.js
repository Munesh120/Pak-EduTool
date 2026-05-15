const express = require('express');
const router = express.Router();

// Your auth routes here
router.post('/login', (req, res) => {
  res.json({ message: 'Login route' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register route' });
});

module.exports = router; // Make sure this exports the router