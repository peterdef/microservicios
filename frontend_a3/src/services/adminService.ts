const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

export const adminService = {
  // Obtener todos los usuarios
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    return response.json();
  },

  // Actualizar usuario
  async updateUser(id: number, userData: any) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar usuario');
    }

    return response.json();
  },

  // Eliminar usuario
  async deleteUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar usuario');
    }

    return response.json();
  },

  // Crear backup manual
  async createBackup() {
    const response = await fetch(`${API_BASE_URL}/admin/backup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear backup');
    }

    return response.json();
  },

  // Obtener lista de backups
  async getBackups() {
    const response = await fetch(`${API_BASE_URL}/admin/backups`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener backups');
    }

    return response.json();
  },

  // Restaurar backup
  async restoreBackup(backupName: string) {
    const response = await fetch(`${API_BASE_URL}/admin/backup/restore/${backupName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al restaurar backup');
    }

    return response.json();
  },

  // Eliminar backup
  async deleteBackup(backupName: string) {
    const response = await fetch(`${API_BASE_URL}/admin/backup/${backupName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar backup');
    }

    return response.json();
  },

  // Exportar datos
  async exportData(format: 'json' = 'json') {
    const response = await fetch(`${API_BASE_URL}/admin/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al exportar datos');
    }

    return response.json();
  },

  // Importar datos
  async importData(data: any) {
    const response = await fetch(`${API_BASE_URL}/admin/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al importar datos');
    }

    return response.json();
  },

  // Obtener estadísticas del sistema
  async getSystemStats() {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas del sistema');
    }

    return response.json();
  },

  // Limpiar backups antiguos
  async cleanOldBackups(daysOld: number = 30) {
    const response = await fetch(`${API_BASE_URL}/admin/backup/clean`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ daysOld }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al limpiar backups antiguos');
    }

    return response.json();
  },

  // Obtener información de salud del sistema
  async getSystemHealth() {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener información de salud del sistema');
    }

    return response.json();
  },

  // Descargar backup
  async downloadBackup(backupName: string) {
    const response = await fetch(`${API_BASE_URL}/admin/backup/${backupName}/download`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al descargar backup');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backupName}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Subir backup
  async uploadBackup(file: File) {
    const formData = new FormData();
    formData.append('backup', file);

    const response = await fetch(`${API_BASE_URL}/admin/backup/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir backup');
    }

    return response.json();
  },

  // Obtener logs del sistema
  async getSystemLogs() {
    const response = await fetch(`${API_BASE_URL}/admin/logs`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener logs del sistema');
    }

    return response.json();
  },

  // Configurar sistema
  async updateSystemConfig(config: any) {
    const response = await fetch(`${API_BASE_URL}/admin/config`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar configuración');
    }

    return response.json();
  },

  // Obtener configuración del sistema
  async getSystemConfig() {
    const response = await fetch(`${API_BASE_URL}/admin/config`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener configuración del sistema');
    }

    return response.json();
  },

  // Reiniciar sistema
  async restartSystem() {
    const response = await fetch(`${API_BASE_URL}/admin/restart`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al reiniciar sistema');
    }

    return response.json();
  },

  // Validar integridad de datos
  async validateDataIntegrity() {
    const response = await fetch(`${API_BASE_URL}/admin/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al validar integridad de datos');
    }

    return response.json();
  },

  // Reparar datos corruptos
  async repairData() {
    const response = await fetch(`${API_BASE_URL}/admin/repair`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al reparar datos');
    }

    return response.json();
  },

  // Obtener métricas de rendimiento
  async getPerformanceMetrics() {
    const response = await fetch(`${API_BASE_URL}/admin/performance`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener métricas de rendimiento');
    }

    return response.json();
  },

  // Optimizar base de datos
  async optimizeDatabase() {
    const response = await fetch(`${API_BASE_URL}/admin/optimize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al optimizar base de datos');
    }

    return response.json();
  },

  // Obtener reportes del sistema
  async getSystemReports() {
    const response = await fetch(`${API_BASE_URL}/admin/reports`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener reportes del sistema');
    }

    return response.json();
  },

  // Generar reporte personalizado
  async generateCustomReport(reportConfig: any) {
    const response = await fetch(`${API_BASE_URL}/admin/reports/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportConfig),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al generar reporte');
    }

    return response.json();
  }
};
