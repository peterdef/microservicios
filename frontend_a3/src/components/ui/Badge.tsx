'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-indigo-100 text-indigo-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseClasses = "inline-flex items-center font-medium rounded-full";
  const badgeClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getStatusConfig = (status: string) => {
    const statusMap: { [key: string]: { variant: BadgeProps['variant']; text: string } } = {
      'PUBLICADO': { variant: 'success', text: 'Publicado' },
      'EN_REVISION': { variant: 'warning', text: 'En Revisión' },
      'BORRADOR': { variant: 'default', text: 'Borrador' },
      'PENDIENTE': { variant: 'info', text: 'Pendiente' },
      'COMPLETADA': { variant: 'success', text: 'Completada' },
      'EN_PROGRESO': { variant: 'warning', text: 'En Progreso' },
      'APROBAR': { variant: 'success', text: 'Aprobar' },
      'CAMBIOS_MINOR': { variant: 'warning', text: 'Cambios Menores' },
      'CAMBIOS_MAJOR': { variant: 'danger', text: 'Cambios Mayores' },
      'RECHAZAR': { variant: 'danger', text: 'Rechazar' }
    };

    return statusMap[status] || { variant: 'default', text: status };
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.text}
    </Badge>
  );
};

interface PriorityBadgeProps {
  priority: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', className = '' }) => {
  const getPriorityConfig = (priority: string) => {
    const priorityMap: { [key: string]: { variant: BadgeProps['variant']; text: string } } = {
      'ALTA': { variant: 'danger', text: 'Alta' },
      'MEDIA': { variant: 'warning', text: 'Media' },
      'BAJA': { variant: 'success', text: 'Baja' }
    };

    return priorityMap[priority] || { variant: 'default', text: priority };
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.text}
    </Badge>
  );
};

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'md', className = '' }) => {
  const getTypeConfig = (type: string) => {
    const typeMap: { [key: string]: { variant: BadgeProps['variant']; text: string } } = {
      'PUBLICACION': { variant: 'primary', text: 'Publicación' },
      'REVISION': { variant: 'info', text: 'Revisión' },
      'SISTEMA': { variant: 'default', text: 'Sistema' },
      'ARTICULO': { variant: 'primary', text: 'Artículo' },
      'REVISION': { variant: 'info', text: 'Revisión' }
    };

    return typeMap[type] || { variant: 'default', text: type };
  };

  const config = getTypeConfig(type);

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.text}
    </Badge>
  );
};

export default Badge;
