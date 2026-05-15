const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only videos'), false);
  }
});

router.post('/video', auth, upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ videoUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;