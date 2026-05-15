const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Temporary store for reset tokens (use DB in production)
const resetTokens = new Map();

// Forgot password - send reset email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const token = crypto.randomBytes(32).toString('hex');
  resetTokens.set(token, { userId: user._id, expires: Date.now() + 3600000 }); // 1 hour
  
  const resetLink = `http://localhost:5001/login.html?token=${token}`;
  
  // Configure your email transporter (example using ethereal for testing)
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'your-ethereal-user@ethereal.email', // Replace with your test account
      pass: 'your-ethereal-pass'
    }
  });
  
  await transporter.sendMail({
    from: '"Pak eduTool" <noreply@pak-edutool.com>',
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 1 hour.</p>`
  });
  
  res.json({ message: 'Reset email sent' });
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const resetData = resetTokens.get(token);
  if (!resetData || resetData.expires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  const user = await User.findById(resetData.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.password = newPassword;
  await user.save();
  resetTokens.delete(token);
  
  res.json({ message: 'Password updated successfully' });
});