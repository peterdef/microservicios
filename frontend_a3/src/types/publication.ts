export enum PublicationType {
  ARTICULO = 'ARTICULO',
  LIBRO = 'LIBRO',
}

export enum PublicationStatus {
  BORRADOR = 'BORRADOR',
  EN_REVISION = 'EN_REVISION',
  CAMBIOS_SOLICITADOS = 'CAMBIOS_SOLICITADOS',
  APROBADO = 'APROBADO',
  PUBLICADO = 'PUBLICADO',
  RETIRADO = 'RETIRADO',
}

export interface PublicationMetadata {
  isbn?: string;
  doi?: string;
  paginas?: number;
  categoria?: string;
  licencia?: string;
  [key: string]: any;
}

export interface Chapter {
  numero: number;
  titulo: string;
  resumenCapitulo: string;
}

export interface Article extends BasePublication {
  tipo: PublicationType.ARTICULO;
  revistaObjetivo?: string;
  seccion?: string;
  referenciasBibliograficas?: string[];
  figuras?: number;
  tablaFigurasMetadata?: any;
}

export interface Book extends BasePublication {
  tipo: PublicationType.LIBRO;
  isbn?: string;
  numeroPaginas?: number;
  edicion?: string;
  capitulos?: Chapter[];
}

export interface BasePublication {
  id?: string;
  titulo: string;
  resumen: string;
  palabrasClave: string[];
  estado: PublicationStatus;
  versionActual: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  autorId: string;
  autor?: string;
  coAutoresIds?: string[];
  metadatos?: PublicationMetadata;
}

export type Publication = Article | Book;

export interface PublicationFormData {
  titulo: string;
  resumen: string;
  palabrasClave: string[];
  tipo: PublicationType;
  // Article specific fields
  revistaObjetivo?: string;
  seccion?: string;
  referenciasBibliograficas?: string[];
  figuras?: number;
  // Book specific fields
  isbn?: string;
  numeroPaginas?: number;
  edicion?: string;
  capitulos?: Chapter[];
  // Metadata
  categoria?: string;
  licencia?: string;
  // Author fields
  autorId?: string;
  autor?: string;
}

export interface PublicationListResponse {
  content: Publication[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PublicationSearchParams {
  page?: number;
  size?: number;
  titulo?: string;
  autor?: string;
  tipo?: PublicationType;
  estado?: PublicationStatus;
  categoria?: string;
  palabrasClave?: string[];
}
