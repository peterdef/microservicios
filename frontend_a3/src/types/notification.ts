export enum NotificationType {
  PUBLICATION_SUBMITTED = 'PUBLICATION_SUBMITTED',
  PUBLICATION_REVIEW_REQUESTED = 'PUBLICATION_REVIEW_REQUESTED',
  PUBLICATION_REVIEW_RETURNED = 'PUBLICATION_REVIEW_RETURNED',
  PUBLICATION_APPROVED = 'PUBLICATION_APPROVED',
  PUBLICATION_PUBLISHED = 'PUBLICATION_PUBLISHED',
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGIN = 'USER_LOGIN',
  REVIEW_ASSIGNED = 'REVIEW_ASSIGNED',
  REVIEW_COMPLETED = 'REVIEW_COMPLETED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
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
  fechaCreacion: string;
  fechaLectura?: string;
  metadata?: Record<string, any>;
  leida: boolean;
}

export interface NotificationTemplate {
  id?: string;
  nombre: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  variables: string[];
  activo: boolean;
}

export interface NotificationPreferences {
  id?: string;
  usuarioId: string;
  email: boolean;
  webPush: boolean;
  inApp: boolean;
  tiposHabilitados: NotificationType[];
}

export interface NotificationListResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface NotificationSearchParams {
  page?: number;
  size?: number;
  tipo?: NotificationType;
  estado?: NotificationStatus;
  prioridad?: NotificationPriority;
  leida?: boolean;
}
