// server/tests/sample.test.js - CORRECTED VERSION
describe('Basic Test Setup', () => {
  
  test('Should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });
  
  test('Environment should be test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
  
  test('Array methods work', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
  
  test('Object equality works', () => {
    const obj = { name: 'Pak eduToll', version: '1.0' };
    expect(obj).toMatchObject({ name: 'Pak eduToll' });
  });
});

describe('Quiz Grading Logic - Corrected', () => {
  
  function calculateGrade(answers, correctAnswers, passingScore = 80) {
    let correct = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      if (answers[i] === correctAnswers[i]) {
        correct++;
      }
    }
    const percentage = Math.round((correct / correctAnswers.length) * 100);
    return {
      passed: percentage >= passingScore,
      percentage: percentage,
      correctCount: correct,
      totalQuestions: correctAnswers.length
    };
  }
  
  const correctAnswers = [1, 2, 2, 0, 0];
  
  test('100% correct should pass', () => {
    const result = calculateGrade([1, 2, 2, 0, 0], correctAnswers);
    expect(result.passed).toBe(true);
    expect(result.percentage).toBe(100);
    expect(result.correctCount).toBe(5);
  });
  
  test('80% correct should pass', () => {
    const result = calculateGrade([1, 2, 2, 0, 3], correctAnswers);
    expect(result.passed).toBe(true);
    expect(result.percentage).toBe(80);
    expect(result.correctCount).toBe(4);
  });
  
  test('60% correct should fail', () => {
    // 3 correct out of 5 = 60%
    const result = calculateGrade([1, 2, 2, 3, 3], correctAnswers);
    expect(result.passed).toBe(false);
    expect(result.percentage).toBe(60);
    expect(result.correctCount).toBe(3);
  });
  
  test('40% correct should fail', () => {
    const result = calculateGrade([1, 2, 3, 3, 3], correctAnswers);
    expect(result.passed).toBe(false);
    expect(result.percentage).toBe(40);
    expect(result.correctCount).toBe(2);
  });
  
  test('20% correct should fail', () => {
    const result = calculateGrade([1, 3, 3, 3, 3], correctAnswers);
    expect(result.passed).toBe(false);
    expect(result.percentage).toBe(20);
    expect(result.correctCount).toBe(1);
  });
  
  test('0% correct should fail', () => {
    const result = calculateGrade([3, 3, 3, 3, 3], correctAnswers);
    expect(result.passed).toBe(false);
    expect(result.percentage).toBe(0);
    expect(result.correctCount).toBe(0);
  });
});