
import { PermissionsList } from 'src/auth/constants/permissions';
import {
  PrismaClient,
  PermissionModule,
} from '../../src/generated/prisma/client';


const permissions = [
  // ---------------- AUTH ----------------
  {
    module: PermissionModule.AUTH,
    name: PermissionsList.LOGIN,
    description: 'Login',
  },
  {
    module: PermissionModule.AUTH,
    name: PermissionsList.LOGOUT,
    description: 'Logout',
  },
  {
    module: PermissionModule.AUTH,
    name: PermissionsList.REFRESH_TOKEN,
    description: 'Refresh access token',
  },

  // ---------------- USERS ----------------
  {
    module: PermissionModule.USERS,
    name: PermissionsList.USERS_CREATE,
    description: 'Create users',
  },
  {
    module: PermissionModule.USERS,
    name: PermissionsList.USERS_READ,
    description: 'View users',
  },
  {
    module: PermissionModule.USERS,
    name: PermissionsList.USERS_UPDATE,
    description: 'Update users',
  },
  {
    module: PermissionModule.USERS,
    name: PermissionsList.USERS_DELETE,
    description: 'Delete users',
  },

// --------------- ORGANIZATIONS ----------------
{
  module: PermissionModule.ORGANIZATIONS,
    name: PermissionsList.ORGANIZATIONS_CREATE,
    description: 'Create organizations',
  },
  {
    module: PermissionModule.ORGANIZATIONS,
    name: PermissionsList.ORGANIZATIONS_READ,
    description: 'View organizations',
  },
  {
    module: PermissionModule.ORGANIZATIONS,
    name: PermissionsList.ORGANIZATIONS_UPDATE,
    description: 'Update organizations',
  },
  {
    module: PermissionModule.ORGANIZATIONS,
    name: PermissionsList.ORGANIZATIONS_DELETE,
    description: 'Delete organizations',
  },
    // --------------- BUILDINGS ----------------
    {
        module: PermissionModule.BUILDINGS,
        name: PermissionsList.BUILDINGS_CREATE,
        description: 'Create buildings',
    },
    {
        module: PermissionModule.BUILDINGS,
        name: PermissionsList.BUILDINGS_READ,
        description: 'View buildings',
    },
    {
        module: PermissionModule.BUILDINGS,
        name: PermissionsList.BUILDINGS_UPDATE,
        description: 'Update buildings',
    },
    {
        module: PermissionModule.BUILDINGS,
        name: PermissionsList.BUILDINGS_DELETE,
        description: 'Delete buildings',
    },  
    // -------------- FLOORS ----------------
    {
        module: PermissionModule.FLOORS,    
        name: PermissionsList.FLOORS_CREATE,
        description: 'Create floors',
    },
    {
        module: PermissionModule.FLOORS,
        name: PermissionsList.FLOORS_READ,
        description: 'View floors',
    },
    {
        module: PermissionModule.FLOORS,
        name: PermissionsList.FLOORS_UPDATE,
        description: 'Update floors',
    }, 
    {
        module: PermissionModule.FLOORS,
        name: PermissionsList.FLOORS_DELETE,
        description: 'Delete floors',
    },
    // -------------- ROOMS ----------------
    {
        module: PermissionModule.ROOMS,
        name: PermissionsList.ROOMS_CREATE,
        description: 'Create rooms',
    },
    {
        module: PermissionModule.ROOMS,
        name: PermissionsList.ROOMS_READ,
        description: 'View rooms',
    },
    {
        module: PermissionModule.ROOMS,
        name: PermissionsList.ROOMS_UPDATE,
        description: 'Update rooms',
    },
    {
        module: PermissionModule.ROOMS,
        name: PermissionsList.ROOMS_DELETE,
        description: 'Delete rooms',
    },   
    // ------------- DEVICE TYPES ----------------
    {
        module: PermissionModule.DEVICE_TYPES,
        name: PermissionsList.DEVICE_TYPES_CREATE,
        description: 'Create device types',
    },
    {
        module: PermissionModule.DEVICE_TYPES,
        name: PermissionsList.DEVICE_TYPES_READ,
        description: 'View device types',
    },
    {
        module: PermissionModule.DEVICE_TYPES,
        name: PermissionsList.DEVICE_TYPES_UPDATE,
        description: 'Update device types',
    },
    {
        module: PermissionModule.DEVICE_TYPES,
        name: PermissionsList.DEVICE_TYPES_DELETE,
        description: 'Delete device types',
    },
    // ------------- DEVICES ----------------
    {
        module: PermissionModule.DEVICES,
        name: PermissionsList.DEVICES_CREATE,
        description: 'Create devices',
    },
    {
        module: PermissionModule.DEVICES,
        name: PermissionsList.DEVICES_READ,
        description: 'View devices',
    },
    {   
        module: PermissionModule.DEVICES,
        name: PermissionsList.DEVICES_UPDATE,
        description: 'Update devices',
    },
    {
        module: PermissionModule.DEVICES,
        name: PermissionsList.DEVICES_DELETE,
        description: 'Delete devices',
    },
    // ------------- EQUIPMENT TYPES ----------------
    {
        module: PermissionModule.EQUIPMENT_TYPES,
        name: PermissionsList.EQUIPMENT_TYPES_CREATE,
        description: 'Create equipment types',
    },
    {
        module: PermissionModule.EQUIPMENT_TYPES,
        name: PermissionsList.EQUIPMENT_TYPES_READ,
        description: 'View equipment types',
    },
    {
        module: PermissionModule.EQUIPMENT_TYPES,
        name: PermissionsList.EQUIPMENT_TYPES_UPDATE,
        description: 'Update equipment types',
    },
    {
        module: PermissionModule.EQUIPMENT_TYPES,
        name: PermissionsList.EQUIPMENT_TYPES_DELETE,
        description: 'Delete equipment types',
    },
    // ------------- EQUIPMENTS ----------------
    {
        module: PermissionModule.EQUIPMENTS,
        name: PermissionsList.EQUIPMENTS_CREATE,
        description: 'Create equipments',
    },
    {
        module: PermissionModule.EQUIPMENTS,
        name: PermissionsList.EQUIPMENTS_READ,
        description: 'View equipments',
    },
    {
        module: PermissionModule.EQUIPMENTS,
        name: PermissionsList.EQUIPMENTS_UPDATE,
        description: 'Update equipments',
    },
    {
        module: PermissionModule.EQUIPMENTS,
        name: PermissionsList.EQUIPMENTS_DELETE,
        description: 'Delete equipments',
    },
    // ------------ PARAMETERS ----------------
    {
        module: PermissionModule.PARAMETERS,
        name: PermissionsList.PARAMETERS_CREATE,
        description: 'Create parameters',
    },
    {
        module: PermissionModule.PARAMETERS,
        name: PermissionsList.PARAMETERS_READ,
        description: 'View parameters',
    },
    {
        module: PermissionModule.PARAMETERS,
        name: PermissionsList.PARAMETERS_UPDATE,
        description: 'Update parameters',
    },
    {
        module: PermissionModule.PARAMETERS,
        name: PermissionsList.PARAMETERS_DELETE,
        description: 'Delete parameters',
    },
    // ------------ HISTORY MODELS ----------------
    {
        module: PermissionModule.HISTORY_MODELS,
        name: PermissionsList.HISTORY_MODELS_READ,
        description: 'View history models',
    },
    {
        module: PermissionModule.HISTORY_MODELS,
        name: PermissionsList.HISTORY_MODELS_CREATE,
        description: 'Create history models',
    },
    {
        module: PermissionModule.HISTORY_MODELS,
        name: PermissionsList.HISTORY_MODELS_UPDATE,
        description: 'Update history models',
    },
    {
        module: PermissionModule.HISTORY_MODELS,
        name: PermissionsList.HISTORY_MODELS_DELETE,
        description: 'Delete history models',
    },
    // ------------- LIGHTING INSTALLATIONS ----------------
    {
        module: PermissionModule.LIGHTING_INSTALLATIONS,
        name: PermissionsList.LIGHTING_INSTALLATIONS_CREATE,
        description: 'Create lighting installations',
    },
    {
        module: PermissionModule.LIGHTING_INSTALLATIONS,
        name: PermissionsList.LIGHTING_INSTALLATIONS_READ,
        description: 'View lighting installations',
    },
    {
        module: PermissionModule.LIGHTING_INSTALLATIONS,
        name: PermissionsList.LIGHTING_INSTALLATIONS_UPDATE,
        description: 'Update lighting installations',
    },
    {
        module: PermissionModule.LIGHTING_INSTALLATIONS,
        name: PermissionsList.LIGHTING_INSTALLATIONS_DELETE,
        description: 'Delete lighting installations',
    }, 
    // ------------- LIGHTING ----------------
    {
        module: PermissionModule.LIGHTING,
        name: PermissionsList.LIGHTING_CREATE,
        description: 'Create lighting',
    },
    {
        module: PermissionModule.LIGHTING,
        name: PermissionsList.LIGHTING_READ,
        description: 'View lighting',
    },
    {
        module: PermissionModule.LIGHTING,
        name: PermissionsList.LIGHTING_UPDATE,
        description: 'Update lighting',
    },
    {
        module: PermissionModule.LIGHTING,
        name: PermissionsList.LIGHTING_DELETE,
        description: 'Delete lighting',
    },

    // ------------ PERMISSIONS ----------------
    {
        module: PermissionModule.PERMISSIONS,
        name: PermissionsList.PERMISSIONS_READ,
        description: 'View permissions',
    },
    // ------------- ROLE PERMISSIONS ----------------
    {
        module: PermissionModule.ROLE_PERMISSIONS,
        name: PermissionsList.ROLE_PERMISSIONS_READ,
        description: 'View role permissions',
    },
    {
        module: PermissionModule.ROLE_PERMISSIONS,
        name: PermissionsList.ROLE_PERMISSIONS_CREATE,
        description: 'Create role permissions',
    },
    {
        module: PermissionModule.ROLE_PERMISSIONS,
        name: PermissionsList.ROLE_PERMISSIONS_UPDATE,
        description: 'Update role permissions',
    },
    {
        module: PermissionModule.ROLE_PERMISSIONS,
        name: PermissionsList.ROLE_PERMISSIONS_DELETE,
        description: 'Delete role permissions',
    },

    // ------------- USER PERMISSIONS ----------------
    {
        module: PermissionModule.USER_PERMISSIONS,
        name: PermissionsList.USER_PERMISSIONS_READ,
        description: 'View user permissions',
    },
    {
        module: PermissionModule.USER_PERMISSIONS,
        name: PermissionsList.USER_PERMISSIONS_UPDATE,
        description: 'Update user permissions',
    },
    

    // ------------ SENSORS ----------------
    {
        module: PermissionModule.SENSORS,
        name: PermissionsList.SENSORS_CREATE,
        description: 'Create sensors',
    },
    {
        module: PermissionModule.SENSORS,
        name: PermissionsList.SENSORS_READ,
        description: 'View sensors',
    },
    {
        module: PermissionModule.SENSORS,
        name: PermissionsList.SENSORS_UPDATE,
        description: 'Update sensors',
    },
    {
        module: PermissionModule.SENSORS,
        name: PermissionsList.SENSORS_DELETE,
        description: 'Delete sensors',
    },
    //  ------------ TELEMETRY ----------------
    {
        module: PermissionModule.TELEMETRY,
        name: PermissionsList.TELEMETRY_READ,
        description: 'View telemetry data',
    },
    // ------------ IMPORTS ----------------
    {
        module: PermissionModule.IMPORTS,
        name: PermissionsList.IMPORTS_EXECUTE,
        description: 'Execute imports',
    },
    // ------------ Reports ----------------
    {
        module: PermissionModule.REPORTS,
        name: PermissionsList.REPORTS_READ,
        description: 'View reports',
    },
    {
        module: PermissionModule.REPORTS,
        name: PermissionsList.REPORTS_EXPORT,
        description: 'Export reports',
    },
    // ------------ AI ----------------
    {
        module: PermissionModule.AI,
        name: PermissionsList.AI_CHAT,
        description: 'Use AI chat',
    },
    // ------------ Audit ----------------
    {
        module: PermissionModule.AUDIT,
        name: PermissionsList.AUDIT_READ,
        description: 'View audit logs',
    },
    // ------------ Settings ----------------
    {
        module: PermissionModule.SETTINGS,
        name: PermissionsList.SETTINGS_READ,
        description: 'View settings',
    },
    {
        module: PermissionModule.SETTINGS,
        name: PermissionsList.SETTINGS_UPDATE,
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