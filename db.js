const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create admin user if not exists
    const User = require('../models/User');
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        isApprovedInstructor: true
      });
      console.log('✅ Admin user created');
    }
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;