
import {
  PrismaClient,
  PermissionModule,
} from '../../src/generated/prisma/client';

import { PERMISSIONS } from './constants';

const permissions = [
  // ---------------- AUTH ----------------
  {
    module: PermissionModule.AUTH,
    name: PERMISSIONS.LOGIN,
    description: 'Login',
  },
  {
    module: PermissionModule.AUTH,
    name: PERMISSIONS.LOGOUT,
    description: 'Logout',
  },
  {
    module: PermissionModule.AUTH,
    name: PERMISSIONS.REFRESH_TOKEN,
    description: 'Refresh access token',
  },

  // ---------------- USERS ----------------
  {
    module: PermissionModule.USERS,
    name: PERMISSIONS.USERS_CREATE,
    description: 'Create users',
  },
{
  module: PermissionModule.USERS,
  name: PERMISSIONS.USERS_READ,
  description: 'View users',
},
{
  module: PermissionModule.USERS,
  name: PERMISSIONS.USERS_UPDATE,
  description: 'Update users',
},
{
  module: PermissionModule.USERS,
  name: PERMISSIONS.USERS_DELETE,
  description: 'Delete users',
},

// --------------- ORGANIZATIONS ----------------
{
  module: PermissionModule.ORGANIZATIONS,
    name: PERMISSIONS.ORGANIZATIONS_CREATE,
    description: 'Create organizations',
  },
  {
    module: PermissionModule.ORGANIZATIONS,
    name: PERMISSIONS.ORGANIZATIONS_READ,
    description: 'View organizations',
  },
  {
    module: PermissionModule.ORGANIZATIONS,
    name: PERMISSIONS.ORGANIZATIONS_UPDATE,
    description: 'Update organizations',
  },
  {
    module: PermissionModule.ORGANIZATIONS,
    name: PERMISSIONS.ORGANIZATIONS_DELETE,
    description: 'Delete organizations',
  },
    // --------------- BUILDINGS ----------------
    {
        module: PermissionModule.BUILDINGS,
        name: PERMISSIONS.BUILDINGS_CREATE,
        description: 'Create buildings',
    },
    {
        module: PermissionModule.BUILDINGS,
        name: PERMISSIONS.BUILDINGS_READ,
        description: 'View buildings',
    },
    {
        module: PermissionModule.BUILDINGS,
        name: PERMISSIONS.BUILDINGS_UPDATE,
        description: 'Update buildings',
    },
    {
        module: PermissionModule.BUILDINGS,
        name: PERMISSIONS.BUILDINGS_DELETE,
        description: 'Delete buildings',
    },  
    // -------------- FLOORS ----------------
    {
        module: PermissionModule.FLOORS,    
        name: PERMISSIONS.FLOORS_CREATE,
        description: 'Create floors',
    },
    {
        module: PermissionModule.FLOORS,
        name: PERMISSIONS.FLOORS_READ,
        description: 'View floors',
    },
    {
        module: PermissionModule.FLOORS,
        name: PERMISSIONS.FLOORS_UPDATE,
        description: 'Update floors',
    }, 
    {
        module: PermissionModule.FLOORS,
        name: PERMISSIONS.FLOORS_DELETE,
        description: 'Delete floors',
    },
    // -------------- ROOMS ----------------
    {
        module: PermissionModule.ROOMS,
        name: PERMISSIONS.ROOMS_CREATE,
        description: 'Create rooms',
    },
    {
        module: PermissionModule.ROOMS,
        name: PERMISSIONS.ROOMS_READ,
        description: 'View rooms',
    },
    {
        module: PermissionModule.ROOMS,
        name: PERMISSIONS.ROOMS_UPDATE,
        description: 'Update rooms',
    },
    {
        module: PermissionModule.ROOMS,
        name: PERMISSIONS.ROOMS_DELETE,
        description: 'Delete rooms',
    },   
    // ------------- DEVICE TYPES ----------------
    {
        module: PermissionModule.DEVICE_TYPES,
        name: PERMISSIONS.DEVICE_TYPES_CREATE,
        description: 'Create device types',
    },
    {
        module: PermissionModule.DEVICE_TYPES,
        name: PERMISSIONS.DEVICE_TYPES_READ,
        description: 'View device types',
    },
    {
        module: PermissionModule.DEVICE_TYPES,
        name: PERMISSIONS.DEVICE_TYPES_UPDATE,
        description: 'Update device types',
    },
    {
        module: PermissionModule.DEVICE_TYPES,
        name: PERMISSIONS.DEVICE_TYPES_DELETE,
        description: 'Delete device types',
    },
    // ------------- DEVICES ----------------
    {
        module: PermissionModule.DEVICES,
        name: PERMISSIONS.DEVICES_CREATE,
        description: 'Create devices',
    },
    {
        module: PermissionModule.DEVICES,
        name: PERMISSIONS.DEVICES_READ,
        description: 'View devices',
    },
    {   
        module: PermissionModule.DEVICES,
        name: PERMISSIONS.DEVICES_UPDATE,
        description: 'Update devices',
    },
    {
        module: PermissionModule.DEVICES,
        name: PERMISSIONS.DEVICES_DELETE,
        description: 'Delete devices',
    },
    // ------------- EQUIPMENT TYPES ----------------
    {
        module: PermissionModule.EQUIPMENT_TYPES,
        name: PERMISSIONS.EQUIPMENT_TYPES_CREATE,
        description: 'Create equipment types',
    },
    {
        module: PermissionModule.EQUIPMENT_TYPES,
        name: PERMISSIONS.EQUIPMENT_TYPES_READ,
        description: 'View equipment types',
    },
    {
        module: PermissionModule.EQUIPMENT_TYPES,
        name: PERMISSIONS.EQUIPMENT_TYPES_UPDATE,
        description: 'Update equipment types',
    },
    {
        module: PermissionModule.EQUIPMENT_TYPES,
        name: PERMISSIONS.EQUIPMENT_TYPES_DELETE,
        description: 'Delete equipment types',
    },
    // ------------- EQUIPMENTS ----------------
    {
        module: PermissionModule.EQUIPMENTS,
        name: PERMISSIONS.EQUIPMENTS_CREATE,
        description: 'Create equipments',
    },
    {
        module: PermissionModule.EQUIPMENTS,
        name: PERMISSIONS.EQUIPMENTS_READ,
        description: 'View equipments',
    },
    {
        module: PermissionModule.EQUIPMENTS,
        name: PERMISSIONS.EQUIPMENTS_UPDATE,
        description: 'Update equipments',
    },
    {
        module: PermissionModule.EQUIPMENTS,
        name: PERMISSIONS.EQUIPMENTS_DELETE,
        description: 'Delete equipments',
    },
    // ------------ PARAMETERS ----------------
    {
        module: PermissionModule.PARAMETERS,
        name: PERMISSIONS.PARAMETERS_CREATE,
        description: 'Create parameters',
    },
    {
        module: PermissionModule.PARAMETERS,
        name: PERMISSIONS.PARAMETERS_READ,
        description: 'View parameters',
    },
    {
        module: PermissionModule.PARAMETERS,
        name: PERMISSIONS.PARAMETERS_UPDATE,
        description: 'Update parameters',
    },
    {
        module: PermissionModule.PARAMETERS,
        name: PERMISSIONS.PARAMETERS_DELETE,
        description: 'Delete parameters',
    },
    // ------------ HISTORY MODELS ----------------
    {
        module: PermissionModule.HISTORY_MODELS,
        name: PERMISSIONS.HISTORY_MODELS_READ,
        description: 'View history models',
    },
    //  ------------ TELEMETRY ----------------
    {
        module: PermissionModule.TELEMETRY,
        name: PERMISSIONS.TELEMETRY_READ,
        description: 'View telemetry data',
    },
    // ------------ IMPORTS ----------------
    {
        module: PermissionModule.IMPORTS,
        name: PERMISSIONS.IMPORTS_EXECUTE,
        description: 'Execute imports',
    },
    // ------------ Reports ----------------
    {
        module: PermissionModule.REPORTS,
        name: PERMISSIONS.REPORTS_READ,
        description: 'View reports',
    },
    {
        module: PermissionModule.REPORTS,
        name: PERMISSIONS.REPORTS_EXPORT,
        description: 'Export reports',
    },
    // ------------ AI ----------------
    {
        module: PermissionModule.AI,
        name: PERMISSIONS.AI_CHAT,
        description: 'Use AI chat',
    },
    // ------------ Audit ----------------
    {
        module: PermissionModule.AUDIT,
        name: PERMISSIONS.AUDIT_READ,
        description: 'View audit logs',
    },
    // ------------ Settings ----------------
    {
        module: PermissionModule.SETTINGS,
        name: PERMISSIONS.SETTINGS_READ,
        description: 'View settings',
    },
    {
        module: PermissionModule.SETTINGS,
        name: PERMISSIONS.SETTINGS_UPDATE,
        description: 'Update settings',
    },
];

export async function seedPermissions(prisma: PrismaClient) {
  const permissionData = permissions.map((permission, index) => ({
    seqNo: index + 1,
    ...permission,
  }));

  for (const permission of permissionData) {
    await prisma.permission.upsert({
      where: {
        name: permission.name,
      },
      update: {
        module: permission.module,
        description: permission.description,
        isActive: true,
      },
      create: {
        ...permission,
        isActive: true,
      },
    });
  }

  console.log('✅ Permissions Seeded');
}