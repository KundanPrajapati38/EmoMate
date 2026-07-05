const express = require('express');
const router = express.Router();
const {
  signup, login, getMe, updateTheme, addEmotionEntry, getEmotionHistory
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/theme', authMiddleware, updateTheme);
router.post('/emotion-history', authMiddleware, addEmotionEntry);
router.get('/emotion-history', authMiddleware, getEmotionHistory);

module.exports = router;
