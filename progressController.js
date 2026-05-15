const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');

const markLessonComplete = async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;
    const userId = req.user._id;
    
    let progress = await Progress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = await Progress.create({ userId, courseId, completedLessons: [], completedQuizzes: [] });
    }
    
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      
      // Calculate overall progress
      const totalLessons = await Lesson.countDocuments({ moduleId: { $in: await Module.find({ courseId }).distinct('_id') } });
      progress.overallProgress = (progress.completedLessons.length / totalLessons) * 100;
      
      await progress.save();
    }
    
    res.json({ success: true, progress: progress.overallProgress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId
    }).populate('unlockedModules.moduleId completedLessons');
    
    res.json({ success: true, data: progress || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { markLessonComplete, getUserProgress };