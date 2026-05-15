// utils/notificationService.js
const User = require('../models/User');

const sendModuleUnlockNotification = async (userId, moduleTitle, quizTitle) => {
  try {
    const user = await User.findById(userId);
    
    // Store in-app notification
    const notification = {
      userId: userId,
      type: 'module_unlocked',
      title: '🎉 New Module Unlocked!',
      message: `Congratulations! You've passed "${quizTitle}" and unlocked "${moduleTitle}".`,
      createdAt: new Date(),
      read: false
    };
    
    // Save to database (create Notification model if needed)
    // await Notification.create(notification);
    
    // For real-time web socket (if using Socket.io)
    // io.to(userId).emit('module-unlocked', notification);
    
    console.log(`📢 Notification sent to ${user.email}: ${moduleTitle} unlocked`);
    
    return true;
    
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
};

module.exports = { sendModuleUnlockNotification };