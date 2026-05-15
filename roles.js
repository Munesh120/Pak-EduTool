const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
};

const PAYMENT_METHODS = {
  UBL: { id: 'ubl', name: 'UBL (United Bank Limited)', type: 'bank' },
  HBL: { id: 'hbl', name: 'HBL (Habib Bank Limited)', type: 'bank' },
  MEEZAN: { id: 'meezan', name: 'Meezan Bank', type: 'bank' },
  ALFALAH: { id: 'alfalah', name: 'Bank Alfalah', type: 'bank' },
  EASYPAISA: { id: 'easypaisa', name: 'EasyPaisa', type: 'wallet' },
  JAZZCASH: { id: 'jazzcash', name: 'JazzCash', type: 'wallet' },
};

module.exports = { ROLES, PAYMENT_STATUS, PAYMENT_METHODS };
