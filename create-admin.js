// create-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pak-edutool';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isApprovedInstructor: Boolean
});

// Check if model exists to prevent "OverwriteModelError"
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists, resetting password...');
      existing.password = await bcrypt.hash('Admin@123', 10);
      await existing.save();
      console.log('✅ Password reset to Admin@123');
    } else {
      const hashed = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashed,
        role: 'admin',
        isApprovedInstructor: true
      });
      console.log('✅ Admin created: admin@example.com / Admin@123');
    }
    process.exit(0);
  } catch (err) { // Fixed: Added parentheses around err
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

createAdmin();