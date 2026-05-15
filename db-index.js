// config/db-indexes.js
const setupIndexes = async () => {
  const QuizResult = require('../models/QuizResult');
  const Progress = require('../models/Progress');
  
  // Optimize quiz result queries
  await QuizResult.collection.createIndex({ userId: 1, quizId: 1, attemptNumber: -1 });
  await QuizResult.collection.createIndex({ completedAt: -1 });
  
  // Optimize progress lookups
  await Progress.collection.createIndex({ userId: 1, courseId: 1 }, { unique: true });
  await Progress.collection.createIndex({ unlockedModules: 1 });
  
  console.log('✅ Database indexes created');
};

module.exports = setupIndexes;