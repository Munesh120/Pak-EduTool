const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'pakedutoll.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT,
    category TEXT,
    level TEXT DEFAULT 'Beginner',
    price REAL DEFAULT 0,
    is_premium INTEGER DEFAULT 0,
    modules_count INTEGER DEFAULT 5,
    duration TEXT,
    thumbnail TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    duration_min INTEGER DEFAULT 10,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    payment_status TEXT DEFAULT 'pending',
    enrolled_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    UNIQUE(user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS module_completions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    completed_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, module_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (module_id) REFERENCES modules(id)
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    cert_number TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    issued_at TEXT DEFAULT (datetime('now')),
    student_name TEXT NOT NULL,
    course_title TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    method TEXT NOT NULL,
    bank_name TEXT,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    transaction_ref TEXT,
    initiated_at TEXT DEFAULT (datetime('now')),
    confirmed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );
`);

const seedCourses = db.prepare('SELECT COUNT(*) as cnt FROM courses').get();
if (seedCourses.cnt === 0) {
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, description, instructor, category, level, price, is_premium, modules_count, duration, thumbnail)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertModule = db.prepare(`
    INSERT INTO modules (id, course_id, title, order_index, duration_min) VALUES (?, ?, ?, ?, ?)
  `);

  const courses = [
    { id: 'c1', title: 'Web Development with React', desc: 'Master modern web development using React, Node.js, and databases. Build production-ready apps from scratch.', instructor: 'Dr. Ahmed Raza', cat: 'Technology', level: 'Intermediate', price: 2999, premium: 1, mods: 6, dur: '24 hours' },
    { id: 'c2', title: 'Python for Data Science', desc: 'Learn Python programming, data analysis, machine learning and visualization using Pandas, NumPy and Scikit-learn.', instructor: 'Prof. Sara Malik', cat: 'Data Science', level: 'Beginner', price: 1999, premium: 1, mods: 5, dur: '18 hours' },
    { id: 'c3', title: 'Digital Marketing Mastery', desc: 'Complete guide to SEO, social media marketing, Google Ads, and content strategy for Pakistani businesses.', instructor: 'Usman Ghani', cat: 'Marketing', level: 'Beginner', price: 1499, premium: 1, mods: 4, dur: '12 hours' },
    { id: 'c4', title: 'Urdu Literature & Poetry', desc: 'Explore classical and modern Urdu literature, poetry analysis, and creative writing techniques.', instructor: 'Dr. Naseem Fatima', cat: 'Arts & Literature', level: 'All Levels', price: 0, premium: 0, mods: 4, dur: '10 hours' },
    { id: 'c5', title: 'Graphic Design Fundamentals', desc: 'Learn Adobe Photoshop, Illustrator and Canva to create stunning designs for print and digital media.', instructor: 'Ali Hassan', cat: 'Design', level: 'Beginner', price: 2499, premium: 1, mods: 5, dur: '20 hours' },
    { id: 'c6', title: 'English Communication Skills', desc: 'Improve your spoken and written English for professional and academic success. IELTS preparation included.', instructor: 'Ms. Amina Pasha', cat: 'Language', level: 'Intermediate', price: 1299, premium: 1, mods: 5, dur: '15 hours' },
  ];

  const moduleTitles = {
    c1: ['HTML & CSS Foundations', 'JavaScript Essentials', 'React Components & Hooks', 'State Management with Redux', 'Node.js & Express APIs', 'Database Integration & Deployment'],
    c2: ['Python Basics', 'NumPy & Pandas', 'Data Visualization', 'Machine Learning Basics', 'Capstone Project'],
    c3: ['SEO Fundamentals', 'Social Media Strategy', 'Google Ads & Analytics', 'Content Marketing'],
    c4: ['Classical Urdu Poetry', 'Modern Literature', 'Creative Writing', 'Poetry Analysis'],
    c5: ['Design Principles', 'Adobe Photoshop', 'Adobe Illustrator', 'Canva & Digital Design', 'Portfolio Building'],
    c6: ['Grammar Essentials', 'Speaking Confidence', 'Business Writing', 'IELTS Reading & Writing', 'IELTS Speaking & Listening'],
  };

  for (const c of courses) {
    insertCourse.run(c.id, c.title, c.desc, c.instructor, c.cat, c.level, c.price, c.premium, c.mods, c.dur, null);
    moduleTitles[c.id].forEach((title, idx) => {
      insertModule.run(uuidv4(), c.id, title, idx + 1, 30 + idx * 10);
    });
  }

  const insertUser = db.prepare(`INSERT OR IGNORE INTO users (id, name, email) VALUES (?, ?, ?)`);
  insertUser.run('demo-user', 'Muhammad Ali', 'ali@example.com');
}

module.exports = db;
