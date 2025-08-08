'use client';

import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Eye, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Plus,
  Search,
  BarChart3,
  Shield,
  Activity,
  Users,
  Database,
  ChevronRight,
  Menu,
  X,
  Crown,
  Briefcase,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { hasPermission, ROLES, ACTOR_DESCRIPTIONS } from '../types/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home, 
      permission: 'dashboard:read',
      roles: [ROLES.ADMIN, ROLES.EDITOR, ROLES.REVISOR, ROLES.AUTOR, ROLES.LECTOR] 
    },
    { 
      name: 'Publicaciones', 
      href: '/publications', 
      icon: FileText, 
      permission: 'publications:read',
      roles: [ROLES.AUTOR, ROLES.EDITOR, ROLES.ADMIN] 
    },
    { 
      name: 'Crear Publicación', 
      href: '/publications/create', 
      icon: Plus, 
      permission: 'publications:write',
      roles: [ROLES.AUTOR] 
    },
    { 
      name: 'Catálogo', 
      href: '/catalog', 
      icon: BookOpen, 
      permission: 'catalog:read_published',
      roles: [ROLES.AUTOR, ROLES.REVISOR, ROLES.EDITOR, ROLES.ADMIN, ROLES.LECTOR] 
    },
    { 
      name: 'Revisiones', 
      href: '/reviews', 
      icon: Eye, 
      permission: 'reviews:read',
      roles: [ROLES.REVISOR, ROLES.EDITOR, ROLES.ADMIN] 
    },
    { 
      name: 'Notificaciones', 
      href: '/notifications', 
      icon: Bell, 
      permission: 'notifications:read',
      roles: [ROLES.AUTOR, ROLES.REVISOR, ROLES.EDITOR, ROLES.ADMIN] 
    },
    { 
      name: 'Config. Notificaciones', 
      href: '/notifications/settings', 
      icon: Settings, 
      permission: 'notifications:write',
      roles: [ROLES.AUTOR, ROLES.REVISOR, ROLES.EDITOR, ROLES.ADMIN] 
    },
  ];

  const adminNavigation = [
    { 
      name: 'Panel Editorial', 
      href: '/admin/editorial', 
      icon: BarChart3, 
      permission: 'editorial:access',
      roles: [ROLES.EDITOR, ROLES.ADMIN] 
    },
    { 
      name: 'Gestión de Revisiones', 
      href: '/admin/reviews', 
      icon: Eye, 
      permission: 'reviews:write',
      roles: [ROLES.EDITOR, ROLES.ADMIN] 
    },
    { 
      name: 'Auditoría', 
      href: '/admin/audit', 
      icon: Activity, 
      permission: 'audit:access',
      roles: [ROLES.ADMIN] 
    },
    { 
      name: 'Gestión de Usuarios', 
      href: '/admin/users', 
      icon: Users, 
      permission: 'users:read',
      roles: [ROLES.ADMIN] 
    },
    { 
      name: 'Configuración del Sistema', 
      href: '/admin/settings', 
      icon: Database, 
      permission: 'settings:access',
      roles: [ROLES.ADMIN] 
    },
  ];

  const hasPermissionForItem = (item: any) => {
    if (!user) return false;
    return hasPermission(user.roles, item.permission);
  };

  const filteredNavigation = navigation.filter(hasPermissionForItem);
  const filteredAdminNavigation = adminNavigation.filter(hasPermissionForItem);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getRoleIcon = (role: string) => {
    const actorDesc = ACTOR_DESCRIPTIONS[role as keyof typeof ACTOR_DESCRIPTIONS];
    if (actorDesc) {
      switch (actorDesc.icon) {
        case 'Crown':
          return <Crown className="w-4 h-4" />;
        case 'Briefcase':
          return <Briefcase className="w-4 h-4" />;
        case 'Eye':
          return <Award className="w-4 h-4" />;
        case 'FileText':
          return <FileText className="w-4 h-4" />;
        case 'BookOpen':
          return <BookOpen className="w-4 h-4" />;
        default:
          return <User className="w-4 h-4" />;
      }
    }
    return <User className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    const actorDesc = ACTOR_DESCRIPTIONS[role as keyof typeof ACTOR_DESCRIPTIONS];
    if (actorDesc) {
      switch (actorDesc.color) {
        case 'purple':
          return 'bg-gradient-to-r from-purple-500 to-pink-500';
        case 'blue':
          return 'bg-gradient-to-r from-blue-500 to-indigo-500';
        case 'amber':
          return 'bg-gradient-to-r from-amber-500 to-orange-500';
        case 'emerald':
          return 'bg-gradient-to-r from-emerald-500 to-green-500';
        case 'gray':
          return 'bg-gradient-to-r from-gray-500 to-slate-500';
        default:
          return 'bg-gradient-to-r from-gray-500 to-slate-500';
      }
    }
    return 'bg-gradient-to-r from-gray-500 to-slate-500';
  };

  const getRoleDisplayName = (role: string) => {
    const actorDesc = ACTOR_DESCRIPTIONS[role as keyof typeof ACTOR_DESCRIPTIONS];
    return actorDesc ? actorDesc.name : role.replace('ROLE_', '');
  };

  const getRoleDescription = (role: string) => {
    const actorDesc = ACTOR_DESCRIPTIONS[role as keyof typeof ACTOR_DESCRIPTIONS];
    return actorDesc ? actorDesc.description : '';
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold gradient-text">
                PubSystem
              </span>
              <p className="text-xs text-gray-500 font-medium">Sistema Académico</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-6 border-b border-gray-100/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center ring-2 ring-white shadow-lg">
                <User className="w-7 h-7 text-indigo-600" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getRoleColor(user?.roles[0] || '')} shadow-lg`}>
                {getRoleIcon(user?.roles[0] || '')}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.nombres} {user?.apellidos}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.roles[0] || '')} text-white shadow-sm`}>
                  {getRoleIcon(user?.roles[0] || '')}
                  <span className="ml-1">{getRoleDisplayName(user?.roles[0] || '')}</span>
                </span>
              </div>
              {user?.roles[0] && (
                <p className="text-xs text-gray-500 mt-1 leading-tight">
                  {getRoleDescription(user.roles[0])}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Navegación Principal
            </h3>
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                  {isActive(item.href) && (
                    <ChevronRight className="ml-auto h-4 w-4 text-white/70" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Admin Navigation */}
          {filteredAdminNavigation.length > 0 && (
            <>
              <div className="pt-8 pb-2">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Administración
                </h3>
              </div>
              <div className="space-y-1">
                {filteredAdminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-red-500/25'
                          : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${
                        isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.name}
                      {isActive(item.href) && (
                        <ChevronRight className="ml-auto h-4 w-4 text-white/70" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100/50">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">PubSystem</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
