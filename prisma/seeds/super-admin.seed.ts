import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../../src/generated/prisma/client';
import { ROLES } from './constants';

export async function seedSuperAdmin(prisma: PrismaClient) {
  const role = await prisma.role.findUnique({
    where: {
      name: ROLES.SUPER_ADMIN,
    },
  });

  if (!role) {
    throw new Error('SUPER_ADMIN role not found');
  }

  const hashedPassword = await bcrypt.hash(
    'Admin@123',
    12,
  );

  await prisma.user.upsert({
    where: {
      email: 'admin@azes.com',
    },

    update: {
      roleId: role.id,
      password: hashedPassword,
    },

    create: {
      seqNo: 1,
      name: 'Super Admin',
      email: 'admin@azes.com',
      password: hashedPassword,
      roleId: role.id,
    },
  });

  console.log('✅ Super Admin Seeded');
}