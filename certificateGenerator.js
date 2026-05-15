// utils/certificateGenerator.js
const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateCertificatePDF(studentData) {
  // Read the HTML template
  let htmlTemplate = fs.readFileSync('./client/src/pages/certificate-template.html', 'utf8');
  
  // Replace placeholders
  htmlTemplate = htmlTemplate
    .replace(/{{studentName}}/g, studentData.name)
    .replace(/{{courseName}}/g, studentData.courseTitle)
    .replace(/{{completionDate}}/g, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
    .replace(/{{certificateId}}/g, studentData.certificateId)
    .replace(/{{grade}}/g, studentData.grade || 'A+ (Distinction)');
  
  // Generate PDF with Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  await browser.close();
  return pdfBuffer;
}

module.exports = { generateCertificatePDF };