// server/tests/quick.test.js
describe('Quick Test - Quiz Grading Logic', () => {
  
  // Our grading function
  function gradeQuiz(answers, correctAnswers, passingScore = 80) {
    let correct = 0;
    answers.forEach((answer, idx) => {
      if (answer === correctAnswers[idx]) correct++;
    });
    const percentage = (correct / correctAnswers.length) * 100;
    return {
      passed: percentage >= passingScore,
      percentage: percentage,
      correct: correct,
      total: correctAnswers.length
    };
  }
  
  const correctAnswers = [1, 2, 2, 0, 0];
  
  test('100% should pass', () => {
    const result = gradeQuiz([1, 2, 2, 0, 0], correctAnswers);
    expect(result.passed).toBe(true);
    expect(result.percentage).toBe(100);
  });
  
  test('80% should pass', () => {
    const result = gradeQuiz([1, 2, 2, 0, 3], correctAnswers);
    expect(result.passed).toBe(true);
    expect(result.percentage).toBe(80);
  });
  
  test('60% should fail', () => {
    const result = gradeQuiz([1, 2, 0, 3, 3], correctAnswers);
    expect(result.passed).toBe(false);
    expect(result.percentage).toBe(60);
  });
  
  test('0% should fail', () => {
    const result = gradeQuiz([3, 3, 3, 3, 3], correctAnswers);
    expect(result.passed).toBe(false);
    expect(result.percentage).toBe(0);
  });
  
  test('Should handle partial answers', () => {
    const result = gradeQuiz([1, 2], correctAnswers);
    expect(result.percentage).toBe(40); // 2/5 correct
  });
});