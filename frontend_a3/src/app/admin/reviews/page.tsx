'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { adminService } from '../../../services/adminService';
import { Layout } from '../../../components/Layout';
import { 
  Eye, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  Users,
  FileText,
  BarChart3,
  RefreshCw,
  Filter,
  Search,
  ArrowRight,
  AlertCircle,
  Info
} from 'lucide-react';

interface Publication {
  id: number;
  titulo: string;
  autores?: string[];
  estado: string;
  fechaCreacion: string;
  autor?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
}

interface Reviewer {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  roles: string[];
  activo: boolean;
}

interface ReviewAssignment {
  id: number;
  publicacion: {
    id: number;
    titulo: string;
    autores?: string[];
  };
  revisor: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
  estado: string;
  fechaAsignacion: string;
  fechaLimite: string;
}

export default function ReviewsManagementPage() {
  const { user } = useAuth();
  const [pendingPublications, setPendingPublications] = useState<Publication[]>([]);
  const [availableReviewers, setAvailableReviewers] = useState<Reviewer[]>([]);
  const [reviewAssignments, setReviewAssignments] = useState<ReviewAssignment[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [selectedReviewer, setSelectedReviewer] = useState<Reviewer | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_EDITOR'))) {
      loadReviewData();
    }
  }, [user]);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      const [publications, reviewers, assignments, stats] = await Promise.all([
        adminService.getPendingPublications(),
        adminService.getAvailableReviewers(),
        adminService.getReviewAssignments(),
        adminService.getReviewStats()
      ]);
      
      setPendingPublications(publications);
      setAvailableReviewers(reviewers);
      setReviewAssignments(assignments);
      setReviewStats(stats);
    } catch (error) {
      console.error('Error loading review data:', error);
      setMessage({ type: 'error', text: 'Error al cargar datos de revisiones' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignReview = async () => {
    if (!selectedPublication || !selectedReviewer) {
      setMessage({ type: 'error', text: 'Debes seleccionar una publicación y un revisor' });
      return;
    }

    try {
      await adminService.assignReview(selectedPublication.id, selectedReviewer.id);
      setMessage({ type: 'success', text: 'Revisión asignada exitosamente' });
      setShowAssignmentModal(false);
      setSelectedPublication(null);
      setSelectedReviewer(null);
      await loadReviewData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al asignar revisión' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASIGNADA':
        return 'bg-blue-100 text-blue-800';
      case 'EN_PROGRESO':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800';
      case 'VENCIDA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASIGNADA':
        return <Eye className="h-4 w-4" />;
      case 'EN_PROGRESO':
        return <Clock className="h-4 w-4" />;
      case 'COMPLETADA':
        return <CheckCircle className="h-4 w-4" />;
      case 'VENCIDA':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  if (!user || (!user.roles.includes('ROLE_ADMIN') && !user.roles.includes('ROLE_EDITOR'))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Denegado</h3>
          <p className="text-gray-500">
            No tienes permisos para acceder a la gestión de revisiones.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando gestión de revisiones...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Revisiones</h1>
              <p className="mt-2 text-gray-600">
                Asigna revisiones a revisores y gestiona el proceso de evaluación
              </p>
            </div>
            <button
              onClick={loadReviewData}
              className="btn-secondary flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Stats */}
        {reviewStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{reviewStats.total}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Asignadas</p>
                  <p className="text-2xl font-bold text-gray-900">{reviewStats.asignadas}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-gray-900">{reviewStats.completadas}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Vencidas</p>
                  <p className="text-2xl font-bold text-gray-900">{reviewStats.vencidas}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Publications */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Publicaciones Pendientes ({pendingPublications.length})
                </h3>
                <button
                  onClick={() => setShowAssignmentModal(true)}
                  className="btn-primary flex items-center"
                  disabled={pendingPublications.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Asignar Revisión
                </button>
              </div>
            </div>
            <div className="p-6">
              {pendingPublications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay publicaciones pendientes de revisión</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPublications.map((publication) => (
                    <div key={publication.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{publication.titulo}</h4>
                          <p className="text-sm text-gray-600">
                            Autores: {publication.autores ? publication.autores.join(', ') : 'Sin autores'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Estado: {publication.estado} • Fecha: {new Date(publication.fechaCreacion).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPublication(publication);
                            setShowAssignmentModal(true);
                          }}
                          className="btn-secondary flex items-center"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Asignar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Assignments */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Asignaciones Activas ({reviewAssignments.length})
              </h3>
            </div>
            <div className="p-6">
              {reviewAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay asignaciones activas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{assignment.publicacion.titulo}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.estado)}`}>
                          {getStatusIcon(assignment.estado)}
                          <span className="ml-1">{assignment.estado}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <p><strong>Revisor:</strong> {assignment.revisor.nombres} {assignment.revisor.apellidos}</p>
                        <p><strong>Límite:</strong> {new Date(assignment.fechaLimite).toLocaleDateString()}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Asignada: {new Date(assignment.fechaAsignacion).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asignar Revisión</h3>
              
              {selectedPublication && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Publicación Seleccionada</h4>
                  <p className="text-sm text-blue-700">{selectedPublication.titulo}</p>
                  <p className="text-xs text-blue-600">
                    Autores: {selectedPublication.autores ? selectedPublication.autores.join(', ') : 'Sin autores'}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Revisor
                </label>
                <select
                  value={selectedReviewer?.id || ''}
                  onChange={(e) => {
                    const reviewer = availableReviewers.find(r => r.id === parseInt(e.target.value));
                    setSelectedReviewer(reviewer || null);
                  }}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Selecciona un revisor</option>
                  {availableReviewers.map((reviewer) => (
                    <option key={reviewer.id} value={reviewer.id}>
                      {reviewer.nombres} {reviewer.apellidos} ({reviewer.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setSelectedPublication(null);
                    setSelectedReviewer(null);
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAssignReview}
                  disabled={!selectedReviewer}
                  className="btn-primary"
                >
                  Asignar Revisión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
