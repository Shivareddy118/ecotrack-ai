const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  greenCredits: { type: Number, default: 0 },
  plasticAvoided: { type: Number, default: 0 },
  role: { type: String, default: 'student' }
});
const User = mongoose.model('User', userSchema);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const salt = await bcrypt.genSalt(10);

  const users = [
    { name: 'Admin User', email: 'admin@campus.edu', password: await bcrypt.hash('admin123', salt), role: 'admin', greenCredits: 0, plasticAvoided: 0 },
    { name: 'Alice Green', email: 'student@campus.edu', password: await bcrypt.hash('password123', salt), role: 'student', greenCredits: 150, plasticAvoided: 15 },
    { name: 'Bob Eco', email: 'bob@campus.edu', password: await bcrypt.hash('password123', salt), role: 'student', greenCredits: 120, plasticAvoided: 12 },
    { name: 'Carol Nature', email: 'carol@campus.edu', password: await bcrypt.hash('password123', salt), role: 'student', greenCredits: 90, plasticAvoided: 9 },
    { name: 'Dave Earth', email: 'dave@campus.edu', password: await bcrypt.hash('password123', salt), role: 'student', greenCredits: 70, plasticAvoided: 7 },
    { name: 'Eve Planet', email: 'eve@campus.edu', password: await bcrypt.hash('password123', salt), role: 'student', greenCredits: 50, plasticAvoided: 5 },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log(`✅ Created user: ${u.email}`);
    } else {
      console.log(`⏭️  User already exists: ${u.email}`);
    }
  }

  console.log('\n🌿 Seed complete!');
  console.log('Login credentials:');
  console.log('  Admin:   admin@campus.edu / admin123');
  console.log('  Student: student@campus.edu / password123');
  await mongoose.disconnect();
}

seed().catch(console.error);
