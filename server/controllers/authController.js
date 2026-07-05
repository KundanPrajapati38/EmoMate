const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc  Register new user
// @route POST /api/auth/signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide username, email and password.' });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, theme: user.theme },
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Server error during signup.' });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password.' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid username or password.' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, theme: user.theme },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// @desc  Get current logged-in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: { id: user._id, username: user.username, email: user.email, theme: user.theme } });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc  Update user theme
// @route PUT /api/auth/theme
const updateTheme = async (req, res) => {
  const { theme } = req.body;
  if (!['light-mode', 'dark-mode'].includes(theme)) {
    return res.status(400).json({ error: 'Invalid theme.' });
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { theme }, { new: true }).select('-password');
    res.json({ theme: user.theme });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc  Add emotion history entry
// @route POST /api/auth/emotion-history
const addEmotionEntry = async (req, res) => {
  const { emotion } = req.body;
  if (!emotion) return res.status(400).json({ error: 'Emotion is required.' });
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { emotionHistory: { emotion, timestamp: new Date() } } },
      { new: true }
    ).select('emotionHistory');
    res.json({ emotionHistory: user.emotionHistory });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc  Get emotion history
// @route GET /api/auth/emotion-history
const getEmotionHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('emotionHistory');
    res.json(user.emotionHistory);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { signup, login, getMe, updateTheme, addEmotionEntry, getEmotionHistory };
