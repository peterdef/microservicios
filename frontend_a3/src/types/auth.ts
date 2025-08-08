export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nombres: string;
    apellidos: string;
    roles: string[];
    activo: boolean;
  };
}

export interface UserRegistrationRequest {
  username: string;
  password: string;
  nombres: string;
  apellidos: string;
  email: string;
  afiliacion?: string;
  orcid?: string;
  biografia?: string;
  fotoUrl?: string;
  roles?: string[];
}

export interface User {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  roles: string[];
  afiliacion?: string;
  orcid?: string;
  biografia?: string;
  fotoUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  nombres: string;
  apellidos: string;
  email: string;
  roles: string[];
}

// Role constants for better type safety - Updated to match specifications
export const ROLES = {
  AUTOR: 'ROLE_AUTOR',
  REVISOR: 'ROLE_REVISOR', 
  EDITOR: 'ROLE_EDITOR',
  ADMIN: 'ROLE_ADMIN',
  LECTOR: 'ROLE_LECTOR'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

// Role permissions mapping - Updated according to actor specifications
export const ROLE_PERMISSIONS = {
  [ROLES.AUTOR]: [
    // Autor: crea y actualiza borradores, responde solicitudes de cambio
    'dashboard:read',
    'publications:read',
    'publications:write',
    'publications:update_draft',
    'publications:respond_changes',
    'notifications:read',
    'notifications:write',
    'catalog:read_published'
  ],
  [ROLES.REVISOR]: [
    // Revisor: evalúa, comenta y emite recomendaciones (aceptar, solicitar cambios, rechazar)
    'dashboard:read',
    'reviews:read',
    'reviews:write',
    'reviews:evaluate',
    'reviews:comment',
    'reviews:recommend',
    'reviews:accept',
    'reviews:request_changes',
    'reviews:reject',
    'publications:read_for_review',
    'notifications:read',
    'notifications:write',
    'catalog:read_published'
  ],
  [ROLES.EDITOR]: [
    // Editor / Administrador Editorial: decide aprobación final, fuerza estados especiales
    'dashboard:read',
    'publications:read',
    'publications:write',
    'publications:delete',
    'publications:force_states',
    'reviews:read',
    'reviews:write',
    'reviews:delete',
    'reviews:assign',
    'reviews:final_approval',
    'notifications:read',
    'notifications:write',
    'editorial:access',
    'catalog:read_published',
    'catalog:manage_published'
  ],
  [ROLES.ADMIN]: [
    // Admin: acceso completo al sistema
    'dashboard:read',
    'publications:read',
    'publications:write',
    'publications:delete',
    'publications:force_states',
    'reviews:read',
    'reviews:write',
    'reviews:delete',
    'reviews:assign',
    'reviews:final_approval',
    'notifications:read',
    'notifications:write',
    'notifications:delete',
    'users:read',
    'users:write',
    'users:delete',
    'admin:access',
    'editorial:access',
    'audit:access',
    'settings:access',
    'backup:access',
    'catalog:read_published',
    'catalog:manage_published'
  ],
  [ROLES.LECTOR]: [
    // Lector / Consumidor: accede al catálogo publicado y consulta metadatos
    'dashboard:read',
    'catalog:read_published',
    'catalog:view_metadata'
  ]
} as const;

// Helper function to check permissions
export const hasPermission = (userRoles: string[], permission: string): boolean => {
  return userRoles.some(role => 
    ROLE_PERMISSIONS[role as RoleType]?.includes(permission as any)
  );
};

// Helper function to check if user has any of the required roles
export const hasRole = (userRoles: string[], requiredRoles: string[]): boolean => {
  return userRoles.some(role => requiredRoles.includes(role));
};

// Actor descriptions for UI
export const ACTOR_DESCRIPTIONS = {
  [ROLES.AUTOR]: {
    name: 'Autor',
    description: 'Crea y actualiza borradores, responde solicitudes de cambio',
    icon: 'FileText',
    color: 'emerald'
  },
  [ROLES.REVISOR]: {
    name: 'Revisor',
    description: 'Evalúa, comenta y emite recomendaciones (aceptar, solicitar cambios, rechazar)',
    icon: 'Eye',
    color: 'amber'
  },
  [ROLES.EDITOR]: {
    name: 'Editor',
    description: 'Decide aprobación final, fuerza estados especiales',
    icon: 'Briefcase',
    color: 'blue'
  },
  [ROLES.ADMIN]: {
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    icon: 'Crown',
    color: 'purple'
  },
  [ROLES.LECTOR]: {
    name: 'Lector',
    description: 'Accede al catálogo publicado y consulta metadatos',
    icon: 'BookOpen',
    color: 'gray'
  }
} as const;
