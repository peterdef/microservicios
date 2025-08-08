'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { publicationService } from '../../../services/publicationService';
import { PublicationFormData, PublicationType, Chapter } from '../../../types/publication';
import { hasPermission, ROLES } from '../../../types/auth';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  BookOpen, 
  FileText,
  Upload,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function CreatePublicationPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [publicationType, setPublicationType] = useState<PublicationType>(PublicationType.ARTICULO);
  const [formData, setFormData] = useState<PublicationFormData>({
    titulo: '',
    resumen: '',
    palabrasClave: [],
    tipo: PublicationType.ARTICULO,
    revistaObjetivo: '',
    seccion: '',
    referenciasBibliograficas: [],
    figuras: 0,
    isbn: '',
    numeroPaginas: 0,
    edicion: '',
    capitulos: [],
    categoria: '',
    licencia: '',
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    
    // Verificar permisos de autor
    if (!isLoading && isAuthenticated && user) {
      if (!hasPermission(user.roles, 'publications:write')) {
        router.push('/publications');
      }
    }
  }, [isAuthenticated, isLoading, router, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleTypeChange = (type: PublicationType) => {
    setPublicationType(type);
    setFormData(prev => ({
      ...prev,
      tipo: type,
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.palabrasClave.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        palabrasClave: [...prev.palabrasClave, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      palabrasClave: prev.palabrasClave.filter((_, i) => i !== index),
    }));
  };

  const addReference = () => {
    if (referenceInput.trim() && !formData.referenciasBibliograficas?.includes(referenceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        referenciasBibliograficas: [...(prev.referenciasBibliograficas || []), referenceInput.trim()],
      }));
      setReferenceInput('');
    }
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      referenciasBibliograficas: prev.referenciasBibliograficas?.filter((_, i) => i !== index) || [],
    }));
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      numero: (formData.capitulos?.length || 0) + 1,
      titulo: '',
      resumenCapitulo: '',
    };
    setFormData(prev => ({
      ...prev,
      capitulos: [...(prev.capitulos || []), newChapter],
    }));
  };

  const updateChapter = (index: number, field: keyof Chapter, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      capitulos: prev.capitulos?.map((chapter, i) => 
        i === index ? { ...chapter, [field]: value } : chapter
      ) || [],
    }));
  };

  const removeChapter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      capitulos: prev.capitulos?.filter((_, i) => i !== index) || [],
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return false;
    }
    if (!formData.resumen.trim()) {
      setError('El resumen es obligatorio');
      return false;
    }
    if (formData.palabrasClave.length === 0) {
      setError('Debes agregar al menos una palabra clave');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await publicationService.createPublication(formData);
      router.push('/publications');
    } catch (error: any) {
      setError(error.message || 'Error al crear la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Verificar permisos de autor
  if (user && !hasPermission(user.roles, 'publications:write')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-red-600 mb-4">
              Solo los autores pueden crear nuevas publicaciones.
            </p>
            <Link
              href="/publications"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Volver a Publicaciones
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/publications"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Crear Nueva Publicación
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Publication Type Selection */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Tipo de Publicación
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleTypeChange(PublicationType.ARTICULO)}
                    className={`relative p-4 border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      publicationType === PublicationType.ARTICULO
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText className={`h-6 w-6 ${
                        publicationType === PublicationType.ARTICULO ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Artículo</h4>
                        <p className="text-sm text-gray-500">Publicación académica en revista</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange(PublicationType.LIBRO)}
                    className={`relative p-4 border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      publicationType === PublicationType.LIBRO
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <BookOpen className={`h-6 w-6 ${
                        publicationType === PublicationType.LIBRO ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Libro</h4>
                        <p className="text-sm text-gray-500">Libro completo o capítulo</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      id="titulo"
                      required
                      value={formData.titulo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      placeholder="Ingresa el título de la publicación"
                    />
                  </div>

                  <div>
                    <label htmlFor="resumen" className="block text-sm font-medium text-gray-700">
                      Resumen *
                    </label>
                    <textarea
                      name="resumen"
                      id="resumen"
                      rows={4}
                      required
                      value={formData.resumen}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      placeholder="Describe brevemente el contenido de la publicación"
                    />
                  </div>

                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                      Categoría
                    </label>
                    <input
                      type="text"
                      name="categoria"
                      id="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      placeholder="Ej: Ciencias de la Computación, Matemáticas, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="licencia" className="block text-sm font-medium text-gray-700">
                      Licencia
                    </label>
                    <select
                      name="licencia"
                      id="licencia"
                      value={formData.licencia}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    >
                      <option value="">Selecciona una licencia</option>
                      <option value="CC-BY">Creative Commons Attribution (CC-BY)</option>
                      <option value="CC-BY-SA">Creative Commons Attribution-ShareAlike (CC-BY-SA)</option>
                      <option value="CC-BY-NC">Creative Commons Attribution-NonCommercial (CC-BY-NC)</option>
                      <option value="CC-BY-NC-SA">Creative Commons Attribution-NonCommercial-ShareAlike (CC-BY-NC-SA)</option>
                      <option value="CC0">Creative Commons Zero (CC0)</option>
                      <option value="All Rights Reserved">Todos los derechos reservados</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Palabras Clave *
                </h3>
                <div className="space-y-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      placeholder="Agregar palabra clave"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.palabrasClave.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.palabrasClave.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="ml-1 text-indigo-600 hover:text-indigo-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article-specific fields */}
            {publicationType === PublicationType.ARTICULO && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Información del Artículo
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="revistaObjetivo" className="block text-sm font-medium text-gray-700">
                        Revista Objetivo
                      </label>
                      <input
                        type="text"
                        name="revistaObjetivo"
                        id="revistaObjetivo"
                        value={formData.revistaObjetivo}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        placeholder="Nombre de la revista"
                      />
                    </div>

                    <div>
                      <label htmlFor="seccion" className="block text-sm font-medium text-gray-700">
                        Sección
                      </label>
                      <input
                        type="text"
                        name="seccion"
                        id="seccion"
                        value={formData.seccion}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        placeholder="Sección de la revista"
                      />
                    </div>

                    <div>
                      <label htmlFor="figuras" className="block text-sm font-medium text-gray-700">
                        Número de Figuras
                      </label>
                      <input
                        type="number"
                        name="figuras"
                        id="figuras"
                        min="0"
                        value={formData.figuras}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  {/* References */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Referencias Bibliográficas</h4>
                    <div className="space-y-4">
                      <div className="flex">
                        <input
                          type="text"
                          value={referenceInput}
                          onChange={(e) => setReferenceInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addReference())}
                          className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                          placeholder="Agregar referencia bibliográfica"
                        />
                        <button
                          type="button"
                          onClick={addReference}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {formData.referenciasBibliograficas && formData.referenciasBibliograficas.length > 0 && (
                        <div className="space-y-2">
                          {formData.referenciasBibliograficas.map((reference, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{reference}</span>
                              <button
                                type="button"
                                onClick={() => removeReference(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Book-specific fields */}
            {publicationType === PublicationType.LIBRO && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Información del Libro
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                        ISBN
                      </label>
                      <input
                        type="text"
                        name="isbn"
                        id="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        placeholder="ISBN del libro"
                      />
                    </div>

                    <div>
                      <label htmlFor="numeroPaginas" className="block text-sm font-medium text-gray-700">
                        Número de Páginas
                      </label>
                      <input
                        type="number"
                        name="numeroPaginas"
                        id="numeroPaginas"
                        min="0"
                        value={formData.numeroPaginas}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="edicion" className="block text-sm font-medium text-gray-700">
                        Edición
                      </label>
                      <input
                        type="text"
                        name="edicion"
                        id="edicion"
                        value={formData.edicion}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        placeholder="1ra, 2da, etc."
                      />
                    </div>
                  </div>

                  {/* Chapters */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Capítulos</h4>
                      <button
                        type="button"
                        onClick={addChapter}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Capítulo
                      </button>
                    </div>
                    {formData.capitulos && formData.capitulos.length > 0 && (
                      <div className="space-y-4">
                        {formData.capitulos.map((chapter, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium text-gray-900">
                                Capítulo {chapter.numero}
                              </h5>
                              <button
                                type="button"
                                onClick={() => removeChapter(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Título del Capítulo
                                </label>
                                <input
                                  type="text"
                                  value={chapter.titulo}
                                  onChange={(e) => updateChapter(index, 'titulo', e.target.value)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                                  placeholder="Título del capítulo"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Resumen del Capítulo
                                </label>
                                <textarea
                                  value={chapter.resumenCapitulo}
                                  onChange={(e) => updateChapter(index, 'resumenCapitulo', e.target.value)}
                                  rows={3}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                                  placeholder="Resumen del contenido del capítulo"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/publications"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Crear Publicación
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
