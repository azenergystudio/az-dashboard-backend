import { PrismaClient } from '../../src/generated/prisma/client';
import { ROLES } from './constants';

export async function seedRolePermissions(prisma: PrismaClient) {
  const superAdmin = await prisma.role.findUnique({
    where: {
      name: ROLES.SUPER_ADMIN,
    },
  });

  if (!superAdmin) return;

  const permissions = await prisma.permission.findMany();

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdmin.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdmin.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Role Permissions Seeded');
}