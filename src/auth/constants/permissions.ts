export const PermissionsList = {
  // Auth
  LOGIN: 'auth.login',
  LOGOUT: 'auth.logout',
  REFRESH_TOKEN: 'auth.refresh',

  // Users
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  // Organizations
  ORGANIZATIONS_CREATE: 'organizations.create',
  ORGANIZATIONS_READ: 'organizations.read',
  ORGANIZATIONS_UPDATE: 'organizations.update',
  ORGANIZATIONS_DELETE: 'organizations.delete',

  // Buildings
  BUILDINGS_CREATE: 'buildings.create',
  BUILDINGS_READ: 'buildings.read',
  BUILDINGS_UPDATE: 'buildings.update',
  BUILDINGS_DELETE: 'buildings.delete',

  // Floors
  FLOORS_CREATE: 'floors.create',
  FLOORS_READ: 'floors.read',
  FLOORS_UPDATE: 'floors.update',
  FLOORS_DELETE: 'floors.delete',

  // Rooms
  ROOMS_CREATE: 'rooms.create',
  ROOMS_READ: 'rooms.read',
  ROOMS_UPDATE: 'rooms.update',
  ROOMS_DELETE: 'rooms.delete',

  // Device Types
  DEVICE_TYPES_CREATE: 'device-types.create',
  DEVICE_TYPES_READ: 'device-types.read',
  DEVICE_TYPES_UPDATE: 'device-types.update',
  DEVICE_TYPES_DELETE: 'device-types.delete',

  // Devices
  DEVICES_CREATE: 'devices.create',
  DEVICES_READ: 'devices.read',
  DEVICES_UPDATE: 'devices.update',
  DEVICES_DELETE: 'devices.delete',

  // Equipment Types
  EQUIPMENT_TYPES_CREATE: 'equipment-types.create',
  EQUIPMENT_TYPES_READ: 'equipment-types.read',
  EQUIPMENT_TYPES_UPDATE: 'equipment-types.update',
  EQUIPMENT_TYPES_DELETE: 'equipment-types.delete',

  // Equipment
  EQUIPMENTS_CREATE: 'equipments.create',
  EQUIPMENTS_READ: 'equipments.read',
  EQUIPMENTS_UPDATE: 'equipments.update',
  EQUIPMENTS_DELETE: 'equipments.delete',

  // Parameters
  PARAMETERS_CREATE: 'parameters.create',
  PARAMETERS_READ: 'parameters.read',
  PARAMETERS_UPDATE: 'parameters.update',
  PARAMETERS_DELETE: 'parameters.delete',

  // History Models
  HISTORY_MODELS_READ: 'history-models.read',

  // Telemetry
  TELEMETRY_READ: 'telemetry.read',

  // Imports
  IMPORTS_EXECUTE: 'imports.execute',

  // Reports
  REPORTS_READ: 'reports.read',
  REPORTS_EXPORT: 'reports.export',

  // AI
  AI_CHAT: 'ai.chat',

  // Audit
  AUDIT_READ: 'audit.read',

  // Settings
  SETTINGS_READ: 'settings.read',
  SETTINGS_UPDATE: 'settings.update',
} as const;
