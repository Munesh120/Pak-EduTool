// server/tests/setup.js - Simplified version without MongoDB
const mongoose = require('mongoose');

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  // Connect to test database (use a different database name)
  const testDBURI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/pak-edutool-test';
  
  try {
    await mongoose.connect(testDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Test database connected');
  } catch (error) {
    console.log('⚠️ MongoDB not available, using mock data only');
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  } catch (error) {
    console.log('⚠️ Cleanup skipped');
  }
});

afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    // Skip if no collections
  }
});