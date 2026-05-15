const express = require('express');
const router = express.Router();

// Your quiz routes
router.post('/submit', (req, res) => {
  res.json({ message: 'Quiz submit route' });
});

router.get('/:quizId/results', (req, res) => {
  res.json({ message: 'Quiz results route' });
});

module.exports = router; // Make sure this exports the router