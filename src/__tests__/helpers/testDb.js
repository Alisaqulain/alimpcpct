import mongoose from 'mongoose';
import User from '@/lib/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mpcpct-test';

let connection = null;

export async function connectTestDb() {
  if (connection) {
    return connection;
  }
  
  try {
    connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return connection;
  } catch (error) {
    console.error('Test DB connection error:', error);
    throw error;
  }
}

export async function disconnectTestDb() {
  if (connection) {
    await mongoose.connection.close();
    connection = null;
  }
}

export async function clearTestDb() {
  if (connection) {
    await User.deleteMany({});
  }
}

export async function createTestUser(userData = {}) {
  const defaultUser = {
    name: 'Test User',
    phoneNumber: '1234567890',
    email: 'test@example.com',
    password: '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', // bcrypt hash for 'password123'
    states: 'Test State',
    city: 'Test City',
    role: 'user',
    ...userData,
  };

  // If password is provided as plain text, hash it
  if (userData.password && !userData.password.startsWith('$2a$')) {
    const bcrypt = require('bcryptjs');
    defaultUser.password = await bcrypt.hash(userData.password, 10);
  }

  return await User.create(defaultUser);
}

