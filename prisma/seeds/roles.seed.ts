import { PrismaClient } from '../../src/generated/prisma/client';
import { ROLES } from './constants';

export async function seedRoles(prisma: PrismaClient) {
  const roles = [
    {
      seqNo: 1,
      name: ROLES.SUPER_ADMIN,
      description: 'System Super Administrator',
    },
    {
      seqNo: 2,
      name: ROLES.ORGANIZATION_ADMIN,
      description: 'Organization Administrator',
    },
    {
      seqNo: 3,
      name: ROLES.USER,
      description: 'Standard User',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
      },
      create: role,
    });
  }

  console.log('✅ Roles Seeded');
}