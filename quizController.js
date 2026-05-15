// controllers/quizController.js
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Progress = require('../models/Progress');
const Module = require('../models/Module');
const Course = require('../models/Course');
const { sendModuleUnlockNotification } = require('../utils/notificationService');

// @route   POST /api/quizzes/submit
// @desc    Submit quiz answers for auto-grading
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body;
    const userId = req.userId;
    
    // Validate inputs
    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid submission data'
      });
    }
    
    // Fetch quiz with populated data
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }
    
    // Check if quiz is active
    if (!quiz.isActive) {
      return res.status(403).json({
        success: false,
        error: 'This quiz is no longer available'
      });
    }
    
    // Get user's previous attempts
    const previousAttempts = await QuizResult.find({
      userId,
      quizId
    }).sort({ attemptNumber: -1 });
    
    const attemptNumber = previousAttempts.length + 1;
    
    // Check max attempts
    if (quiz.maxAttempts && previousAttempts.length >= quiz.maxAttempts) {
      const bestAttempt = previousAttempts.reduce((best, current) => 
        current.percentage > best.percentage ? current : best
      );
      
      return res.status(403).json({
        success: false,
        error: `Maximum attempts (${quiz.maxAttempts}) reached`,
        bestScore: bestAttempt.percentage,
        canRetake: false
      });
    }
    
    // Check time limit
    if (quiz.timeLimit && timeSpent > quiz.timeLimit * 60) {
      return res.status(400).json({
        success: false,
        error: `Time limit of ${quiz.timeLimit} minutes exceeded`,
        timeSpent: timeSpent
      });
    }
    
    // Auto-grading logic
    let totalPointsEarned = 0;
    const gradedAnswers = [];
    
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const userAnswer = answers[i];
      
      const isCorrect = (userAnswer === question.correctOption);
      const pointsEarned = isCorrect ? question.points : 0;
      
      totalPointsEarned += pointsEarned;
      
      gradedAnswers.push({
        questionId: question._id,
        selectedOption: userAnswer,
        isCorrect: isCorrect,
        pointsEarned: pointsEarned,
        correctAnswer: question.correctOption, // For feedback
        explanation: question.explanation // For learning
      });
    }
    
    // Calculate percentage
    const percentage = (totalPointsEarned / quiz.totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;
    
    // Save quiz result
    const quizResult = new QuizResult({
      userId,
      quizId,
      courseId: quiz.courseId,
      moduleId: quiz.moduleId,
      attemptNumber,
      score: totalPointsEarned,
      percentage: percentage,
      passed: passed,
      answers: gradedAnswers,
      timeSpent: timeSpent || 0,
      completedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    await quizResult.save();
    
    // Update user progress
    let progress = await Progress.findOne({ userId, courseId: quiz.courseId });
    if (!progress) {
      progress = new Progress({
        userId,
        courseId: quiz.courseId,
        completedLessons: [],
        completedQuizzes: [],
        unlockedModules: []
      });
    }
    
    // Add quiz completion record
    progress.completedQuizzes.push({
      quizId: quiz._id,
      passedAt: passed ? new Date() : null,
      score: percentage
    });
    
    // AUTO-UNLOCK NEXT MODULE IF QUIZ PASSED (80%+)
    let nextModuleUnlocked = false;
    let nextModule = null;
    
    if (passed) {
      // Get current module order
      const currentModule = await Module.findById(quiz.moduleId);
      if (currentModule) {
        // Find the next module in the course sequence
        nextModule = await Module.findOne({
          courseId: quiz.courseId,
          order: currentModule.order + 1
        });
        
        if (nextModule) {
          // Unlock the next module
          await progress.unlockModule(nextModule._id);
          nextModuleUnlocked = true;
          
          // Send real-time notification
          await sendModuleUnlockNotification(userId, nextModule.title, quiz.title);
          
          console.log(`✅ Module ${nextModule.title} unlocked for user ${userId}`);
        }
      }
    }
    
    // Update overall progress
    const totalModules = await Module.countDocuments({ courseId: quiz.courseId });
    const unlockedCount = progress.unlockedModules.length;
    progress.overallProgress = (unlockedCount / totalModules) * 100;
    
    await progress.save();
    
    // Prepare detailed response
    const responseData = {
      success: true,
      passed: passed,
      percentage: percentage,
      score: `${totalPointsEarned}/${quiz.totalPoints}`,
      passingScore: quiz.passingScore,
      attemptNumber: attemptNumber,
      attemptsRemaining: quiz.maxAttempts ? quiz.maxAttempts - attemptNumber : null,
      nextModuleUnlocked: nextModuleUnlocked,
      feedback: {
        correctAnswers: gradedAnswers.filter(a => a.isCorrect).length,
        totalQuestions: quiz.questions.length,
        message: passed 
          ? `🎉 Congratulations! You scored ${percentage}% and passed the quiz!`
          : `📚 You scored ${percentage}%. You need ${quiz.passingScore}% to pass. ${quiz.maxAttempts ? `You have ${quiz.maxAttempts - attemptNumber} attempts remaining.` : 'Please review the material and try again.'}`
      }
    };
    
    // If failed, provide detailed answer breakdown
    if (!passed) {
      responseData.detailedAnswers = gradedAnswers.map((answer, idx) => ({
        questionNumber: idx + 1,
        wasCorrect: answer.isCorrect,
        correctAnswer: answer.correctAnswer,
        explanation: answer.explanation
      }));
    }
    
    // If passed and next module unlocked, include next module info
    if (passed && nextModuleUnlocked && nextModule) {
      responseData.nextModule = {
        id: nextModule._id,
        title: nextModule.title,
        order: nextModule.order,
        message: `✨ Module "${nextModule.title}" has been unlocked!`
      };
    }
    
    // Check if this was the final module quiz
    const allModules = await Module.find({ courseId: quiz.courseId }).sort({ order: 1 });
    const lastModule = allModules[allModules.length - 1];
    
    if (passed && currentModule && currentModule.order === lastModule.order) {
      responseData.isLastModule = true;
      responseData.finalExamMessage = "🎯 You've completed all module quizzes! The Final Exam is now available.";
      
      // Unlock final exam (if exists)
      const finalExam = await Quiz.findOne({ 
        courseId: quiz.courseId, 
        type: 'final_exam' 
      });
      if (finalExam) {
        responseData.finalExamUnlocked = true;
      }
    }
    
    res.status(200).json(responseData);
    
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while processing quiz'
    });
  }
};

// @route   GET /api/quizzes/:quizId/results
// @desc    Get user's quiz history
// @access  Private
const getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId;
    
    const results = await QuizResult.find({ userId, quizId })
      .sort({ attemptNumber: -1 })
      .select('-answers'); // Exclude detailed answers for privacy
    
    const quiz = await Quiz.findById(quizId).select('title passingScore maxAttempts');
    
    res.json({
      success: true,
      quizTitle: quiz.title,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      attempts: results,
      bestScore: results.length > 0 ? Math.max(...results.map(r => r.percentage)) : 0
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/quizzes/:quizId/check-access
// @desc    Check if user can access quiz (module unlocked)
// @access  Private
const checkQuizAccess = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId;
    
    const quiz = await Quiz.findById(quizId).populate('moduleId');
    
    // Get user progress
    const progress = await Progress.findOne({ 
      userId, 
      courseId: quiz.courseId 
    });
    
    if (!progress) {
      // First module should be unlocked by default
      const firstModule = await Module.findOne({ 
        courseId: quiz.courseId 
      }).sort({ order: 1 });
      
      const isFirstModule = quiz.moduleId.toString() === firstModule._id.toString();
      
      if (isFirstModule) {
        return res.json({
          success: true,
          canAccess: true,
          message: "First module quiz is accessible"
        });
      }
      
      return res.json({
        success: false,
        canAccess: false,
        message: "Complete previous modules first"
      });
    }
    
    // Check if module is unlocked
    const isUnlocked = progress.isModuleUnlocked(quiz.moduleId._id);
    
    res.json({
      success: true,
      canAccess: isUnlocked,
      message: isUnlocked ? "Quiz accessible" : "Complete the previous module's quiz with 80%+ to unlock"
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitQuiz,
  getQuizResults,
  checkQuizAccess
};