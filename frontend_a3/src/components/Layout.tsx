'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogOut, 
  User, 
  Shield, 
  BookOpen, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Home,
  Menu,
  X,
  TrendingUp,
  Users,
  Database,
  Activity,
  Calendar,
  Tag,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'ROLE_AUTOR': 'Autor',
      'ROLE_REVISOR': 'Revisor',
      'ROLE_EDITOR': 'Editor',
      'ROLE_ADMIN': 'Administrador',
      'ROLE_LECTOR': 'Lector'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors: { [key: string]: string } = {
      'ROLE_AUTOR': 'bg-blue-100 text-blue-800',
      'ROLE_REVISOR': 'bg-green-100 text-green-800',
      'ROLE_EDITOR': 'bg-purple-100 text-purple-800',
      'ROLE_ADMIN': 'bg-red-100 text-red-800',
      'ROLE_LECTOR': 'bg-gray-100 text-gray-800'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role: string) => {
    const roleIcons: { [key: string]: React.ReactNode } = {
      'ROLE_AUTOR': <BookOpen className="h-4 w-4" />,
      'ROLE_REVISOR': <Eye className="h-4 w-4" />,
      'ROLE_EDITOR': <Edit className="h-4 w-4" />,
      'ROLE_ADMIN': <Shield className="h-4 w-4" />,
      'ROLE_LECTOR': <User className="h-4 w-4" />
    };
    return roleIcons[role] || <User className="h-4 w-4" />;
  };

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      titulo: 'Nueva revisión asignada',
      mensaje: 'Se te ha asignado una nueva revisión: "Fundamentos de Programación Web"',
      tipo: 'REVISION_ASIGNADA',
      fecha: '2024-01-25',
      leida: false,
      prioridad: 'ALTA'
    },
    {
      id: 2,
      titulo: 'Publicación aprobada',
      mensaje: 'Tu publicación "Análisis de Algoritmos de Machine Learning" ha sido aprobada',
      tipo: 'PUBLICACION_APROBADA',
      fecha: '2024-01-22',
      leida: true,
      prioridad: 'MEDIA'
    },
    {
      id: 3,
      titulo: 'Cambios solicitados',
      mensaje: 'Se han solicitado cambios en tu publicación "Inteligencia Artificial en Medicina"',
      tipo: 'CAMBIOS_SOLICITADOS',
      fecha: '2024-01-24',
      leida: false,
      prioridad: 'ALTA'
    }
  ];

  const unreadCount = mockNotifications.filter(n => !n.leida).length;

  // Navigation items based on user roles
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: <Home className="h-5 w-5" />, 
      roles: ['ROLE_AUTOR', 'ROLE_REVISOR', 'ROLE_EDITOR', 'ROLE_ADMIN', 'ROLE_LECTOR'] 
    },
    { 
      name: 'Mis Publicaciones', 
      href: '/publications', 
      icon: <BookOpen className="h-5 w-5" />, 
      roles: ['ROLE_AUTOR'] 
    },
    { 
      name: 'Revisiones Asignadas', 
      href: '/reviews', 
      icon: <Eye className="h-5 w-5" />, 
      roles: ['ROLE_REVISOR'] 
    },
    { 
      name: 'Catálogo', 
      href: '/catalog', 
      icon: <Search className="h-5 w-5" />, 
      roles: ['ROLE_LECTOR', 'ROLE_AUTOR', 'ROLE_REVISOR', 'ROLE_EDITOR', 'ROLE_ADMIN'] 
    },
    { 
      name: 'Notificaciones', 
      href: '/notifications', 
      icon: <Bell className="h-5 w-5" />, 
      roles: ['ROLE_AUTOR', 'ROLE_REVISOR', 'ROLE_EDITOR', 'ROLE_ADMIN'] 
    },
    { 
      name: 'Administración', 
      href: '/admin', 
      icon: <Settings className="h-5 w-5" />, 
      roles: ['ROLE_ADMIN'] 
    }
  ];

  const userNavigation = navigation.filter(item => 
    item.roles.some(role => user?.roles.includes(role))
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Sistema Académico</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.nombres} {user.apellidos}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {user.roles.map((role) => (
              <span
                key={role}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
              >
                {getRoleIcon(role)}
                <span className="ml-1">{getRoleDisplayName(role)}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-6 py-4 space-y-2">
          {userNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Acciones Rápidas
          </h3>
          <div className="space-y-2">
            {user.roles.includes('ROLE_AUTOR') && (
              <Link
                href="/publications/create"
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Plus className="h-5 w-5" />
                <span>Nueva Publicación</span>
              </Link>
            )}
            <Link
              href="/catalog"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Search className="h-5 w-5" />
              <span>Explorar Catálogo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {mockNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                              !notification.leida ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className={`h-2 w-2 rounded-full ${
                                  notification.prioridad === 'ALTA' ? 'bg-red-500' :
                                  notification.prioridad === 'MEDIA' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.titulo}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {notification.mensaje}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.fecha}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <Link
                          href="/notifications"
                          className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                          Ver todas las notificaciones
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.nombres}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user.nombres} {user.apellidos}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="px-4 py-2">
                        <div className="space-y-1">
                          {user.roles.map((role) => (
                            <div key={role} className="flex items-center space-x-2">
                              {getRoleIcon(role)}
                              <span className="text-sm text-gray-700">
                                {getRoleDisplayName(role)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-gray-200">
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(notificationsOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setNotificationsOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};
