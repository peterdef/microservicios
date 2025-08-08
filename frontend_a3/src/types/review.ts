export enum ReviewStatus {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  DEVUELTA = 'DEVUELTA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
}

export enum ReviewRecommendation {
  ACEPTAR = 'ACEPTAR',
  ACEPTAR_CON_CAMBIOS = 'ACEPTAR_CON_CAMBIOS',
  RECHAZAR = 'RECHAZAR',
  SOLICITAR_CAMBIOS = 'SOLICITAR_CAMBIOS',
}

export interface ReviewComment {
  id?: string;
  seccion: string;
  comentario: string;
  nivelSeveridad: 'BAJA' | 'MEDIA' | 'ALTA';
  sugerencias?: string;
  fechaCreacion?: string;
}

export interface Review {
  id?: string;
  publicacionId: string;
  revisorId: string;
  estadoRevision: ReviewStatus;
  recomendacion?: ReviewRecommendation;
  comentarios: ReviewComment[];
  historialCambios?: ReviewChange[];
  fechaAsignacion?: string;
  fechaInicio?: string;
  fechaCompletado?: string;
  tiempoEstimado?: number; // en días
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA';
}

export interface ReviewChange {
  id?: string;
  fechaCambio: string;
  campoCambiado: string;
  valorAnterior: string;
  valorNuevo: string;
  comentario?: string;
}

export interface ReviewAssignment {
  id?: string;
  publicacionId: string;
  revisorId: string;
  fechaAsignacion: string;
  fechaLimite?: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  instruccionesEspeciales?: string;
}

export interface ReviewFormData {
  recomendacion: ReviewRecommendation;
  comentarios: ReviewComment[];
  comentarioGeneral?: string;
}

export interface ReviewListResponse {
  content: Review[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ReviewSearchParams {
  page?: number;
  size?: number;
  estado?: ReviewStatus;
  revisorId?: string;
  publicacionId?: string;
  prioridad?: string;
}

export interface CreateReviewRequest {
  publicacion: {
    id: number;
    titulo: string;
    autor: {
      id: number;
      nombres: string;
      apellidos: string;
      email: string;
    };
  };
  revisor: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
}

export interface UpdateReviewRequest {
  estado?: string;
  comentarios?: string;
  recomendacion?: string;
  puntuacion?: number;
  aspectosEvaluados?: string[];
  fechaCompletado?: string;
}
