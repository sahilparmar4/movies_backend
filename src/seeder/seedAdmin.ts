import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../model/User';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL as string;
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';
const SALT_ROUNDS = 10;

async function seed() {
  if (!MONGO_URL) {
    console.error('MONGO_URL is not set in environment');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB for seeding');

  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL }).exec();
    if (existing) {
      console.log(`Admin user with email ${ADMIN_EMAIL} already exists. Updating password.`);
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
      existing.password = hashed;
      existing.role = 'admin';
      await existing.save();
      console.log('Admin user password updated.');
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    const admin = new User({
      email: ADMIN_EMAIL,
      password: hashed,
      role: 'admin',
    } as any);
    await admin.save();
    console.log(`Admin user created with email: ${ADMIN_EMAIL}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
