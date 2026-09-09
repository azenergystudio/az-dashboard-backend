import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { seedRoles } from './seeds/roles.seed';
import { seedPermissions } from './seeds/permissions.seed';
import { seedRolePermissions } from './seeds/role-permissions.seed';
import { seedSuperAdmin } from './seeds/super-admin.seed';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting Seed...');

  await seedRoles(prisma);
  await seedPermissions(prisma);
  await seedRolePermissions(prisma);
  await seedSuperAdmin(prisma);

  console.log('✅ All Seeders Completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });