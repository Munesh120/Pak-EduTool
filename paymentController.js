const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { PAYMENT_STATUS } = require('../config/roles');

const initiatePayment = (req, res) => {
  try {
    const { userId, courseId, method, bankName } = req.body;
    if (!userId || !courseId || !method) {
      return res.status(400).json({ success: false, message: 'userId, courseId, and method are required' });
    }

    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const enrollment = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    if (!enrollment) {
      db.prepare(`INSERT INTO enrollments (id, user_id, course_id, progress, payment_status) VALUES (?, ?, ?, 0, 'pending')`)
        .run(uuidv4(), userId, courseId);
    }

    const paymentId = uuidv4();
    const transRef = `TXN-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

    db.prepare(`
      INSERT INTO payments (id, user_id, course_id, method, bank_name, amount, status, transaction_ref)
      VALUES (?, ?, ?, ?, ?, ?, 'processing', ?)
    `).run(paymentId, userId, courseId, method, bankName || null, course.price, transRef);

    res.json({
      success: true,
      payment: {
        id: paymentId,
        transactionRef: transRef,
        amount: course.price,
        method,
        bankName,
        status: PAYMENT_STATUS.PROCESSING,
        courseTitle: course.title,
        instructions: getPaymentInstructions(method, bankName, course.price, transRef),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const confirmPayment = (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ success: false, message: 'paymentId required' });

    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (payment.status === 'confirmed') {
      return res.json({ success: true, message: 'Payment already confirmed', payment });
    }

    db.prepare(`UPDATE payments SET status = 'confirmed', confirmed_at = datetime('now') WHERE id = ?`).run(paymentId);
    db.prepare(`UPDATE enrollments SET payment_status = 'confirmed' WHERE user_id = ? AND course_id = ?`)
      .run(payment.user_id, payment.course_id);

    const updatedPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(payment.course_id);

    res.json({
      success: true,
      message: 'Payment confirmed! Course is now unlocked.',
      payment: updatedPayment,
      courseTitle: course?.title,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPaymentStatus = (req, res) => {
  try {
    const { id } = req.params;
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    const course = db.prepare('SELECT title FROM courses WHERE id = ?').get(payment.course_id);
    res.json({ success: true, payment, courseTitle: course?.title });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPaymentInstructions = (method, bankName, amount, ref) => {
  const formatted = `Rs. ${amount.toLocaleString('en-PK')}`;
  const banks = {
    ubl: { account: '3882-4-4567890', title: 'Pak EduToll (Pvt) Ltd', iban: 'PK74UNIL0109000048561600' },
    hbl: { account: '0123-456789-01', title: 'Pak EduToll (Pvt) Ltd', iban: 'PK36HABB0000000012345678' },
    meezan: { account: '01230123456789', title: 'Pak EduToll (Pvt) Ltd', iban: 'PK70MEZN0001230123456789' },
    alfalah: { account: '0123456789012', title: 'Pak EduToll (Pvt) Ltd', iban: 'PK03ALFH0071001000030023' },
  };
  const wallets = {
    easypaisa: { number: '0300-1234567', name: 'EasyPaisa' },
    jazzcash: { number: '0312-7654321', name: 'JazzCash' },
  };

  if (method === 'bank' && bankName && banks[bankName]) {
    const b = banks[bankName];
    return [
      `Transfer ${formatted} to the following account:`,
      `Account Title: ${b.title}`,
      `Account No: ${b.account}`,
      `IBAN: ${b.iban}`,
      `Use Reference: ${ref}`,
      `After transfer, click "Confirm Payment" below.`,
    ];
  }
  if (method === 'wallet' && bankName && wallets[bankName]) {
    const w = wallets[bankName];
    return [
      `Send ${formatted} via ${w.name} to:`,
      `Number: ${w.number}`,
      `Account Name: Pak EduToll`,
      `Use Reference/Description: ${ref}`,
      `After sending, click "Confirm Payment" below.`,
    ];
  }
  return [`Transfer ${formatted} using your selected method. Use ref: ${ref}`];
};

module.exports = { initiatePayment, confirmPayment, getPaymentStatus };
