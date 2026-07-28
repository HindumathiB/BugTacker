import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { Bug } from '../models/Bug';

const SAMPLE_BUGS = [
  {
    title: 'Login button unresponsive on Safari',
    description: 'Clicking the login button on Safari 17 does nothing. Works fine on Chrome and Firefox.',
    severity: 'High' as const,
    priority: 'High' as const,
    assignedTo: 'Priya Sharma',
    status: 'Open' as const,
  },
  {
    title: 'Dashboard stats cards show stale data',
    description: 'Stat cards do not refresh after creating a new bug until the page is manually reloaded.',
    severity: 'Medium' as const,
    priority: 'Medium' as const,
    assignedTo: 'Arjun Mehta',
    status: 'In Progress' as const,
  },
  {
    title: 'Application crashes on null assignedTo field',
    description: 'Legacy bug records created before validation was added can crash the details page.',
    severity: 'Critical' as const,
    priority: 'High' as const,
    assignedTo: 'Neha Verma',
    status: 'Open' as const,
  },
  {
    title: 'Typo in navigation bar label',
    description: '"Dashbord" should read "Dashboard".',
    severity: 'Low' as const,
    priority: 'Low' as const,
    assignedTo: 'Rohit Nair',
    status: 'Closed' as const,
  },
  {
    title: 'Bug edit form does not persist severity change',
    description: 'Updating severity on the edit screen reverts to the original value after saving.',
    severity: 'Medium' as const,
    priority: 'Medium' as const,
    assignedTo: 'Priya Sharma',
    status: 'In Progress' as const,
  },
];

async function seed(): Promise<void> {
  await mongoose.connect(env.mongoUri);
  console.log('[seed] Connected to MongoDB');

  await User.deleteMany({});
  await Bug.deleteMany({});
  console.log('[seed] Cleared existing users and bugs');

  const hashedPassword = await bcrypt.hash(env.seedAdminPassword, 10);
  await User.create({
    name: env.seedAdminName,
    email: env.seedAdminEmail,
    password: hashedPassword,
  });
  console.log(`[seed] Created admin user: ${env.seedAdminEmail}`);

  await Bug.insertMany(SAMPLE_BUGS);
  console.log(`[seed] Inserted ${SAMPLE_BUGS.length} sample bugs`);

  await mongoose.disconnect();
  console.log('[seed] Done. Disconnected from MongoDB.');
}

seed().catch((error) => {
  console.error('[seed] Seeding failed:', error);
  process.exit(1);
});
