const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');
const { authMiddleware } = require('../controllers/authController');

const publicUser = (user) => {
  const value = user.toJSON();
  delete value.password;
  return value;
};

router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
    const address = typeof req.body.address === 'string' ? req.body.address.trim() : '';

    if (name.length < 2) {
      return res.status(400).json({ message: 'Please enter a name with at least 2 characters.' });
    }

    req.user.name = name;
    req.user.phone = phone && phone !== 'Not provided' ? phone : null;
    req.user.address = address && address !== 'Not provided' ? address : null;
    await req.user.save();

    return res.json({
      message: 'Profile updated successfully.',
      user: publicUser(req.user)
    });
  } catch (error) {
    return res.status(400).json({
      message: error.errors?.[0]?.message || 'Could not update profile.'
    });
  }
});

router.put('/me/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must contain at least 6 characters.' });
    }

    const user = await User.scope('withPassword').findByPk(req.user.id);
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Your current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not change password.' });
  }
});

module.exports = router;
