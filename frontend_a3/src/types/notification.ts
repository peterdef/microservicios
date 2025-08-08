export enum NotificationType {
  PUBLICATION_SUBMITTED = 'PUBLICATION_SUBMITTED',
  PUBLICATION_REVIEW_REQUESTED = 'PUBLICATION_REVIEW_REQUESTED',
  PUBLICATION_REVIEW_RETURNED = 'PUBLICATION_REVIEW_RETURNED',
  PUBLICATION_APPROVED = 'PUBLICATION_APPROVED',
  PUBLICATION_PUBLISHED = 'PUBLICATION_PUBLISHED',
  PUBLICATION_REJECTED = 'PUBLICATION_REJECTED',
  PUBLICATION_CHANGES_REQUESTED = 'PUBLICATION_CHANGES_REQUESTED',
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGIN = 'USER_LOGIN',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  REVIEW_ASSIGNED = 'REVIEW_ASSIGNED',
  REVIEW_STARTED = 'REVIEW_STARTED',
  REVIEW_COMPLETED = 'REVIEW_COMPLETED',
  REVIEW_OVERDUE = 'REVIEW_OVERDUE',
  REVIEW_REMINDER = 'REVIEW_REMINDER',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
  BACKUP_CREATED = 'BACKUP_CREATED',
  BACKUP_RESTORED = 'BACKUP_RESTORED',
  CITATION_RECEIVED = 'CITATION_RECEIVED',
  COMMENT_RECEIVED = 'COMMENT_RECEIVED',
  EDITORIAL_DECISION = 'EDITORIAL_DECISION',
  PUBLICATION_VIEWED = 'PUBLICATION_VIEWED',
  PUBLICATION_DOWNLOADED = 'PUBLICATION_DOWNLOADED',
  NEW_PUBLICATION_AVAILABLE = 'NEW_PUBLICATION_AVAILABLE',
  REVIEWER_INVITATION = 'REVIEWER_INVITATION',
  REVIEWER_ACCEPTED = 'REVIEWER_ACCEPTED',
  REVIEWER_DECLINED = 'REVIEWER_DECLINED',
  PUBLICATION_ARCHIVED = 'PUBLICATION_ARCHIVED',
  PUBLICATION_RESTORED = 'PUBLICATION_RESTORED',
  USER_ACCOUNT_LOCKED = 'USER_ACCOUNT_LOCKED',
  USER_ACCOUNT_UNLOCKED = 'USER_ACCOUNT_UNLOCKED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  SETTINGS_CHANGED = 'SETTINGS_CHANGED',
  EXPORT_COMPLETED = 'EXPORT_COMPLETED',
  IMPORT_COMPLETED = 'IMPORT_COMPLETED',
  AUDIT_LOG_CREATED = 'AUDIT_LOG_CREATED',
  SECURITY_ALERT = 'SECURITY_ALERT',
  PERFORMANCE_ALERT = 'PERFORMANCE_ALERT',
  STORAGE_WARNING = 'STORAGE_WARNING',
  BACKUP_FAILED = 'BACKUP_FAILED',
  RESTORE_FAILED = 'RESTORE_FAILED',
  EMAIL_SENT = 'EMAIL_SENT',
  EMAIL_FAILED = 'EMAIL_FAILED',
  PUSH_NOTIFICATION_SENT = 'PUSH_NOTIFICATION_SENT',
  PUSH_NOTIFICATION_FAILED = 'PUSH_NOTIFICATION_FAILED'
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum NotificationCategory {
  PUBLICATION = 'PUBLICATION',
  REVIEW = 'REVIEW',
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  ADMIN = 'ADMIN',
  EDITORIAL = 'EDITORIAL',
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
  BACKUP = 'BACKUP',
  EMAIL = 'EMAIL'
}

export interface Notification {
  id?: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  destinatarioId: string;
  remitenteId?: string;
  estado: NotificationStatus;
  prioridad: NotificationPriority;
  categoria: NotificationCategory;
  fechaCreacion: string;
  fechaLectura?: string;
  fechaArchivado?: string;
  metadata?: Record<string, any>;
  leida: boolean;
  urgente: boolean;
  accion?: string;
  urlAccion?: string;
  icono?: string;
  color?: string;
  expiraEn?: string;
  grupoId?: string;
  version?: string;
  tags?: string[];
  relacionadoCon?: {
    tipo: 'publication' | 'review' | 'user' | 'system';
    id: string;
    titulo?: string;
  };
}

export interface NotificationTemplate {
  id?: string;
  nombre: string;
  tipo: NotificationType;
  categoria: NotificationCategory;
  titulo: string;
  mensaje: string;
  variables: string[];
  activo: boolean;
  rolesDestinatarios: string[];
  prioridadPorDefecto: NotificationPriority;
  configuracion: {
    email: boolean;
    webPush: boolean;
    inApp: boolean;
    retencionDias: number;
    agrupable: boolean;
    expirable: boolean;
    diasExpiracion?: number;
  };
}

export interface NotificationPreferences {
  id?: string;
  usuarioId: string;
  email: boolean;
  webPush: boolean;
  inApp: boolean;
  tiposHabilitados: NotificationType[];
  categoriasHabilitadas: NotificationCategory[];
  prioridadesHabilitadas: NotificationPriority[];
  configuracion: {
    frecuencia: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    agrupacion: boolean;
    retencionDias: number;
    idioma: string;
    zonaHoraria: string;
  };
}

export interface NotificationListResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  unreadCount: number;
  urgentCount: number;
}

export interface NotificationSearchParams {
  page?: number;
  size?: number;
  tipo?: NotificationType;
  categoria?: NotificationCategory;
  estado?: NotificationStatus;
  prioridad?: NotificationPriority;
  leida?: boolean;
  urgente?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  destinatarioId?: string;
  remitenteId?: string;
  grupoId?: string;
  tags?: string[];
  relacionadoCon?: {
    tipo: string;
    id: string;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  urgent: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
  byStatus: Record<NotificationStatus, number>;
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
  topTypes: Array<{
    tipo: NotificationType;
    count: number;
    percentage: number;
  }>;
  deliveryStats: {
    email: number;
    webPush: number;
    inApp: number;
    failed: number;
  };
}

// Role-based notification types - Updated to match actor specifications
export const ROLE_NOTIFICATION_TYPES = {
  ROLE_AUTOR: [
    // Autor: crea y actualiza borradores, responde solicitudes de cambio
    NotificationType.PUBLICATION_SUBMITTED,
    NotificationType.PUBLICATION_CHANGES_REQUESTED,
    NotificationType.PUBLICATION_APPROVED,
    NotificationType.PUBLICATION_PUBLISHED,
    NotificationType.PUBLICATION_REJECTED,
    NotificationType.REVIEW_COMPLETED,
    NotificationType.CITATION_RECEIVED,
    NotificationType.COMMENT_RECEIVED,
    NotificationType.PUBLICATION_VIEWED,
    NotificationType.PUBLICATION_DOWNLOADED,
    NotificationType.PASSWORD_CHANGED,
    NotificationType.PROFILE_UPDATED,
    NotificationType.SETTINGS_CHANGED
  ],
  ROLE_REVISOR: [
    // Revisor: evalúa, comenta y emite recomendaciones
    NotificationType.REVIEW_ASSIGNED,
    NotificationType.REVIEW_STARTED,
    NotificationType.REVIEW_COMPLETED,
    NotificationType.REVIEW_OVERDUE,
    NotificationType.REVIEW_REMINDER,
    NotificationType.REVIEWER_INVITATION,
    NotificationType.REVIEWER_ACCEPTED,
    NotificationType.REVIEWER_DECLINED,
    NotificationType.PUBLICATION_SUBMITTED,
    NotificationType.PUBLICATION_REVIEW_REQUESTED,
    NotificationType.PUBLICATION_REVIEW_RETURNED,
    NotificationType.PUBLICATION_APPROVED,
    NotificationType.PUBLICATION_PUBLISHED,
    NotificationType.PUBLICATION_REJECTED,
    NotificationType.PUBLICATION_CHANGES_REQUESTED,
    NotificationType.NEW_PUBLICATION_AVAILABLE,
    NotificationType.PASSWORD_CHANGED,
    NotificationType.PROFILE_UPDATED,
    NotificationType.SETTINGS_CHANGED
  ],
  ROLE_EDITOR: [
    // Editor / Administrador Editorial: decide aprobación final, fuerza estados especiales
    NotificationType.PUBLICATION_SUBMITTED,
    NotificationType.PUBLICATION_REVIEW_REQUESTED,
    NotificationType.PUBLICATION_REVIEW_RETURNED,
    NotificationType.PUBLICATION_APPROVED,
    NotificationType.PUBLICATION_PUBLISHED,
    NotificationType.PUBLICATION_REJECTED,
    NotificationType.PUBLICATION_CHANGES_REQUESTED,
    NotificationType.REVIEW_ASSIGNED,
    NotificationType.REVIEW_STARTED,
    NotificationType.REVIEW_COMPLETED,
    NotificationType.REVIEW_OVERDUE,
    NotificationType.REVIEW_REMINDER,
    NotificationType.REVIEWER_INVITATION,
    NotificationType.REVIEWER_ACCEPTED,
    NotificationType.REVIEWER_DECLINED,
    NotificationType.EDITORIAL_DECISION,
    NotificationType.PUBLICATION_ARCHIVED,
    NotificationType.PUBLICATION_RESTORED,
    NotificationType.NEW_PUBLICATION_AVAILABLE,
    NotificationType.PASSWORD_CHANGED,
    NotificationType.PROFILE_UPDATED,
    NotificationType.SETTINGS_CHANGED
  ],
  ROLE_ADMIN: [
    // Admin: acceso completo al sistema
    NotificationType.SYSTEM_ALERT,
    NotificationType.SYSTEM_MAINTENANCE,
    NotificationType.SECURITY_ALERT,
    NotificationType.PERFORMANCE_ALERT,
    NotificationType.STORAGE_WARNING,
    NotificationType.BACKUP_CREATED,
    NotificationType.BACKUP_RESTORED,
    NotificationType.BACKUP_FAILED,
    NotificationType.RESTORE_FAILED,
    NotificationType.USER_REGISTERED,
    NotificationType.USER_ROLE_CHANGED,
    NotificationType.USER_ACCOUNT_LOCKED,
    NotificationType.USER_ACCOUNT_UNLOCKED,
    NotificationType.AUDIT_LOG_CREATED,
    NotificationType.EXPORT_COMPLETED,
    NotificationType.IMPORT_COMPLETED,
    NotificationType.EMAIL_SENT,
    NotificationType.EMAIL_FAILED,
    NotificationType.PUSH_NOTIFICATION_SENT,
    NotificationType.PUSH_NOTIFICATION_FAILED,
    // También recibe notificaciones editoriales
    NotificationType.PUBLICATION_SUBMITTED,
    NotificationType.PUBLICATION_APPROVED,
    NotificationType.PUBLICATION_PUBLISHED,
    NotificationType.REVIEW_COMPLETED,
    NotificationType.EDITORIAL_DECISION
  ],
  ROLE_LECTOR: [
    // Lector / Consumidor: accede al catálogo publicado y consulta metadatos
    NotificationType.NEW_PUBLICATION_AVAILABLE,
    NotificationType.PUBLICATION_VIEWED,
    NotificationType.PUBLICATION_DOWNLOADED,
    NotificationType.CITATION_RECEIVED,
    NotificationType.COMMENT_RECEIVED,
    NotificationType.PASSWORD_CHANGED,
    NotificationType.PROFILE_UPDATED,
    NotificationType.SETTINGS_CHANGED
  ]
} as const;
