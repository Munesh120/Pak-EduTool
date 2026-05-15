// controllers/certificateController.js
const generateCertificate = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;
  
  const progress = await Progress.findOne({ userId, courseId });
  const course = await Course.findById(courseId);
  const user = await User.findById(userId);
  
  if (!progress.isCourseCompleted) {
    return res.status(403).json({ error: 'Course not completed' });
  }
  if (progress.certificateIssued) {
    return res.json({ message: 'Certificate already generated' });
  }
  
  const certificateData = {
    studentName: user.name,
    courseName: course.title,
    completionDate: new Date().toLocaleDateString(),
    certificateId: `CERT-${userId.slice(-6)}-${courseId.slice(-4)}`
  };
  
  const html = renderCertificateHTML(certificateData);
  const pdfBuffer = await generatePDF(html);
  
  // Save to DB if needed
  progress.certificateIssued = true;
  await progress.save();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
};