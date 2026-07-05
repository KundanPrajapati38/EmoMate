require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.mongodb.net/emomate?retryWrites=true&w=majority';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const usersJsonPath = path.join(__dirname, '../users.json');
    if (!fs.existsSync(usersJsonPath)) {
      console.log('No users.json file found to seed.');
      process.exit(0);
    }

    const fileContent = fs.readFileSync(usersJsonPath, 'utf-8');
    const oldUsers = JSON.parse(fileContent);

    for (const u of oldUsers) {
      const existing = await User.findOne({ username: u.username });
      if (existing) {
        console.log(`User ${u.username} already exists in MongoDB.`);
        continue;
      }

      // Hash password if not already hashed (assuming plain text in users.json)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);

      await User.create({
        username: u.username,
        email: u.email || `${u.username}@example.com`,
        password: hashedPassword,
        theme: u.theme === 'light' ? 'light-mode' : 'dark-mode',
        emotionHistory: []
      });
      console.log(`Seeded user: ${u.username}`);
    }

    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();
