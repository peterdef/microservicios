// Servicio centralizado para manejar datos mock y simular flujo real
export class MockDataService {
  private static instance: MockDataService;
  
  // Datos mock iniciales - Updated to match actor specifications
  private mockData = {
    users: [
      {
        id: 1,
        email: 'autor@test.com',
        password: 'password',
        nombres: 'Juan',
        apellidos: 'Autor',
        roles: ['ROLE_AUTOR'],
        activo: true,
        afiliacion: 'Universidad Nacional',
        orcid: '0000-0001-2345-6789',
        biografia: 'Autor que crea y actualiza borradores, responde solicitudes de cambio.',
        fotoUrl: '',
        fechaRegistro: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        email: 'revisor@test.com',
        password: 'password',
        nombres: 'María',
        apellidos: 'Revisora',
        roles: ['ROLE_REVISOR'],
        activo: true,
        afiliacion: 'Instituto Tecnológico',
        orcid: '0000-0002-3456-7890',
        biografia: 'Revisor que evalúa, comenta y emite recomendaciones (aceptar, solicitar cambios, rechazar).',
        fotoUrl: '',
        fechaRegistro: '2024-01-02T00:00:00Z'
      },
      {
        id: 3,
        email: 'editor@test.com',
        password: 'password',
        nombres: 'Carlos',
        apellidos: 'Editor',
        roles: ['ROLE_EDITOR'],
        activo: true,
        afiliacion: 'Editorial Científica',
        orcid: '0000-0003-4567-8901',
        biografia: 'Editor que decide aprobación final, fuerza estados especiales.',
        fotoUrl: '',
        fechaRegistro: '2024-01-03T00:00:00Z'
      },
      {
        id: 4,
        email: 'admin@test.com',
        password: 'password',
        nombres: 'Ana',
        apellidos: 'Administradora',
        roles: ['ROLE_ADMIN'],
        activo: true,
        afiliacion: 'Sistema de Gestión',
        orcid: '0000-0004-5678-9012',
        biografia: 'Administrador con acceso completo al sistema.',
        fotoUrl: '',
        fechaRegistro: '2024-01-04T00:00:00Z'
      },
      {
        id: 5,
        email: 'lector@test.com',
        password: 'password',
        nombres: 'Pedro',
        apellidos: 'Lector',
        roles: ['ROLE_LECTOR'],
        activo: true,
        afiliacion: 'Biblioteca Universitaria',
        orcid: '0000-0005-6789-0123',
        biografia: 'Lector que accede al catálogo publicado y consulta metadatos.',
        fotoUrl: '',
        fechaRegistro: '2024-01-05T00:00:00Z'
      }
    ],
    publications: [
      {
        id: 1,
        titulo: 'Introducción a la Inteligencia Artificial',
        resumen: 'Un análisis completo de los fundamentos de la IA moderna y sus aplicaciones en el mundo actual.',
        contenido: 'La inteligencia artificial ha revolucionado la forma en que interactuamos con la tecnología. Desde los asistentes virtuales hasta los sistemas de recomendación, la IA está presente en casi todos los aspectos de nuestra vida digital. Este artículo explora los fundamentos teóricos y prácticos de la IA, incluyendo machine learning, deep learning y procesamiento del lenguaje natural.',
        autor: {
          id: 1,
          nombres: 'Juan',
          apellidos: 'Autor',
          email: 'autor@test.com'
        },
        estado: 'PUBLICADO',
        tipo: 'ARTICULO',
        palabrasClave: ['IA', 'Machine Learning', 'Tecnología', 'Innovación'],
        fechaCreacion: '2024-01-15T10:00:00Z',
        fechaPublicacion: '2024-01-20T10:00:00Z',
        categoria: 'Tecnología',
        doi: '10.1234/ai-intro-2024',
        citaciones: 15,
        descargas: 234,
        vistas: 1250,
        version: '1.0',
        idioma: 'es',
        licencia: 'CC BY 4.0'
      },
      {
        id: 2,
        titulo: 'Machine Learning en Medicina',
        resumen: 'Aplicaciones del machine learning en diagnóstico médico y tratamiento personalizado.',
        contenido: 'El machine learning está transformando la medicina de manera fundamental. Desde el diagnóstico temprano de enfermedades hasta la personalización de tratamientos, los algoritmos de ML están ayudando a los médicos a tomar decisiones más informadas. Este artículo presenta casos de estudio reales y analiza el impacto de estas tecnologías en la práctica médica.',
        autor: {
          id: 1,
          nombres: 'Juan',
          apellidos: 'Autor',
          email: 'autor@test.com'
        },
        estado: 'EN_REVISION',
        tipo: 'ARTICULO',
        palabrasClave: ['ML', 'Medicina', 'Diagnóstico', 'Salud'],
        fechaCreacion: '2024-02-01T10:00:00Z',
        fechaPublicacion: null,
        categoria: 'Medicina',
        doi: null,
        citaciones: 0,
        descargas: 0,
        vistas: 45,
        version: '1.0',
        idioma: 'es',
        licencia: 'CC BY 4.0'
      },
      {
        id: 3,
        titulo: 'Blockchain y Criptomonedas',
        resumen: 'Análisis del impacto de blockchain en finanzas y economía digital.',
        contenido: 'La tecnología blockchain ha creado nuevas formas de transacciones y ha revolucionado el concepto de confianza en la economía digital. Este artículo explora los fundamentos de blockchain, su aplicación en criptomonedas y el potencial para transformar otros sectores como la logística, la salud y la gobernanza.',
        autor: {
          id: 1,
          nombres: 'Juan',
          apellidos: 'Autor',
          email: 'autor@test.com'
        },
        estado: 'BORRADOR',
        tipo: 'REVISION',
        palabrasClave: ['Blockchain', 'Criptomonedas', 'Finanzas', 'Tecnología'],
        fechaCreacion: '2024-02-10T10:00:00Z',
        fechaPublicacion: null,
        categoria: 'Finanzas',
        doi: null,
        citaciones: 0,
        descargas: 0,
        vistas: 12,
        version: '0.1',
        idioma: 'es',
        licencia: 'CC BY 4.0'
      }
    ],
    reviews: [
      {
        id: 1,
        publicacion: {
          id: 1,
          titulo: 'Introducción a la Inteligencia Artificial',
          autor: {
            id: 1,
            nombres: 'Juan',
            apellidos: 'Autor',
            email: 'autor@test.com'
          }
        },
        revisor: {
          id: 2,
          nombres: 'María',
          apellidos: 'Revisora',
          email: 'revisor@test.com'
        },
        estado: 'COMPLETADA',
        comentarios: 'Excelente trabajo. El contenido es claro y bien estructurado. La metodología es sólida y las conclusiones están bien fundamentadas. Recomiendo la publicación sin cambios.',
        recomendacion: 'APROBAR',
        fechaAsignacion: '2024-01-16T10:00:00Z',
        fechaCompletado: '2024-01-18T10:00:00Z',
        puntuacion: 4.5,
        aspectosEvaluados: ['Claridad', 'Originalidad', 'Metodología', 'Relevancia'],
        tiempoRevision: 48, // horas
        confidencial: false,
        version: '1.0'
      },
      {
        id: 2,
        publicacion: {
          id: 2,
          titulo: 'Machine Learning en Medicina',
          autor: {
            id: 1,
            nombres: 'Juan',
            apellidos: 'Autor',
            email: 'autor@test.com'
          }
        },
        revisor: {
          id: 2,
          nombres: 'María',
          apellidos: 'Revisora',
          email: 'revisor@test.com'
        },
        estado: 'EN_PROGRESO',
        comentarios: 'El artículo presenta una buena base pero necesita más detalles en la metodología y validación de resultados. Se requieren cambios menores antes de la publicación.',
        recomendacion: 'CAMBIOS_MINOR',
        fechaAsignacion: '2024-02-02T10:00:00Z',
        fechaCompletado: null,
        puntuacion: 3.5,
        aspectosEvaluados: ['Claridad', 'Originalidad', 'Metodología'],
        tiempoRevision: 24, // horas
        confidencial: false,
        version: '1.0'
      },
      {
        id: 3,
        publicacion: {
          id: 3,
          titulo: 'Blockchain y Criptomonedas',
          autor: {
            id: 1,
            nombres: 'Juan',
            apellidos: 'Autor',
            email: 'autor@test.com'
          }
        },
        revisor: {
          id: 2,
          nombres: 'María',
          apellidos: 'Revisora',
          email: 'revisor@test.com'
        },
        estado: 'PENDIENTE',
        comentarios: null,
        recomendacion: null,
        fechaAsignacion: '2024-02-11T10:00:00Z',
        fechaCompletado: null,
        puntuacion: null,
        aspectosEvaluados: [],
        tiempoRevision: 0,
        confidencial: false,
        version: '1.0'
      }
    ],
    notifications: [
      {
        id: 1,
        titulo: 'Nueva publicación creada',
        mensaje: 'Tu publicación "Introducción a la Inteligencia Artificial" ha sido creada exitosamente y está disponible para revisión.',
        tipo: 'PUBLICATION_SUBMITTED',
        categoria: 'PUBLICATION',
        prioridad: 'MEDIA',
        leida: false,
        urgente: false,
        fechaCreacion: '2024-01-15T10:00:00Z',
        usuario: {
          id: 1,
          nombres: 'Juan',
          apellidos: 'Autor',
          email: 'autor@test.com'
        },
        accion: 'VER_PUBLICACION',
        urlAccion: '/publications/1',
        icono: 'FileText',
        color: 'blue',
        metadata: {
          publicationId: 1,
          publicationTitle: 'Introducción a la Inteligencia Artificial'
        },
        relacionadoCon: {
          tipo: 'publication',
          id: '1',
          titulo: 'Introducción a la Inteligencia Artificial'
        }
      },
      {
        id: 2,
        titulo: 'Revisión asignada',
        mensaje: 'Se te ha asignado la revisión de "Machine Learning en Medicina". Por favor, completa la revisión antes del 15 de febrero.',
        tipo: 'REVIEW_ASSIGNED',
        categoria: 'REVIEW',
        prioridad: 'ALTA',
        leida: false,
        urgente: true,
        fechaCreacion: '2024-01-16T14:30:00Z',
        usuario: {
          id: 2,
          nombres: 'María',
          apellidos: 'Revisora',
          email: 'revisor@test.com'
        },
        accion: 'INICIAR_REVISION',
        urlAccion: '/reviews/2',
        icono: 'Eye',
        color: 'amber',
        metadata: {
          reviewId: 2,
          publicationId: 2,
          publicationTitle: 'Machine Learning en Medicina',
          fechaLimite: '2024-02-15T23:59:59Z'
        },
        relacionadoCon: {
          tipo: 'review',
          id: '2',
          titulo: 'Machine Learning en Medicina'
        }
      },
      {
        id: 3,
        titulo: 'Publicación aprobada',
        mensaje: 'Tu publicación "Introducción a la Inteligencia Artificial" ha sido aprobada y publicada. Ya está disponible para la comunidad académica.',
        tipo: 'PUBLICATION_APPROVED',
        categoria: 'PUBLICATION',
        prioridad: 'BAJA',
        leida: true,
        urgente: false,
        fechaCreacion: '2024-01-17T09:15:00Z',
        usuario: {
          id: 1,
          nombres: 'Juan',
          apellidos: 'Autor',
          email: 'autor@test.com'
        },
        accion: 'VER_PUBLICACION',
        urlAccion: '/publications/1',
        icono: 'CheckCircle',
        color: 'green',
        metadata: {
          publicationId: 1,
          publicationTitle: 'Introducción a la Inteligencia Artificial'
        },
        relacionadoCon: {
          tipo: 'publication',
          id: '1',
          titulo: 'Introducción a la Inteligencia Artificial'
        }
      },
      {
        id: 4,
        titulo: 'Nuevo usuario registrado',
        mensaje: 'Se ha registrado un nuevo usuario: Dr. Carlos Investigador (carlos@investigador.com)',
        tipo: 'USER_REGISTERED',
        categoria: 'ADMIN',
        prioridad: 'MEDIA',
        leida: false,
        urgente: false,
        fechaCreacion: '2024-01-18T11:20:00Z',
        usuario: {
          id: 4,
          nombres: 'Ana',
          apellidos: 'Administradora',
          email: 'admin@test.com'
        },
        accion: 'GESTIONAR_USUARIO',
        urlAccion: '/admin/users',
        icono: 'UserPlus',
        color: 'purple',
        metadata: {
          newUserId: 6,
          newUserEmail: 'carlos@investigador.com',
          newUserName: 'Dr. Carlos Investigador'
        },
        relacionadoCon: {
          tipo: 'user',
          id: '6',
          titulo: 'Dr. Carlos Investigador'
        }
      },
      {
        id: 5,
        titulo: 'Recordatorio de revisión',
        mensaje: 'Tu revisión de "Machine Learning en Medicina" vence en 3 días. Por favor, completa la revisión a tiempo.',
        tipo: 'REVIEW_REMINDER',
        categoria: 'REVIEW',
        prioridad: 'ALTA',
        leida: false,
        urgente: true,
        fechaCreacion: '2024-01-19T08:00:00Z',
        usuario: {
          id: 2,
          nombres: 'María',
          apellidos: 'Revisora',
          email: 'revisor@test.com'
        },
        accion: 'COMPLETAR_REVISION',
        urlAccion: '/reviews/2',
        icono: 'Clock',
        color: 'red',
        metadata: {
          reviewId: 2,
          publicationId: 2,
          publicationTitle: 'Machine Learning en Medicina',
          diasRestantes: 3
        },
        relacionadoCon: {
          tipo: 'review',
          id: '2',
          titulo: 'Machine Learning en Medicina'
        }
      },
      {
        id: 6,
        titulo: 'Cambios solicitados',
        mensaje: 'Se han solicitado cambios en tu publicación "Machine Learning en Medicina". Revisa los comentarios del revisor.',
        tipo: 'PUBLICATION_CHANGES_REQUESTED',
        categoria: 'PUBLICATION',
        prioridad: 'MEDIA',
        leida: false,
        urgente: false,
        fechaCreacion: '2024-01-20T16:45:00Z',
        usuario: {
          id: 1,
          nombres: 'Juan',
          apellidos: 'Autor',
          email: 'autor@test.com'
        },
        accion: 'REVISAR_CAMBIOS',
        urlAccion: '/publications/2',
        icono: 'AlertCircle',
        color: 'orange',
        metadata: {
          publicationId: 2,
          publicationTitle: 'Machine Learning en Medicina',
          reviewId: 2
        },
        relacionadoCon: {
          tipo: 'publication',
          id: '2',
          titulo: 'Machine Learning en Medicina'
        }
      },
      {
        id: 7,
        titulo: 'Revisión iniciada',
        mensaje: 'Has iniciado la revisión de "Machine Learning en Medicina". Continúa con la evaluación y emite tu recomendación.',
        tipo: 'REVIEW_STARTED',
        categoria: 'REVIEW',
        prioridad: 'MEDIA',
        leida: false,
        urgente: false,
        fechaCreacion: '2024-01-20T14:30:00Z',
        usuario: {
          id: 2,
          nombres: 'María',
          apellidos: 'Revisora',
          email: 'revisor@test.com'
        },
        accion: 'COMPLETAR_REVISION',
        urlAccion: '/reviews/2',
        icono: 'Eye',
        color: 'blue',
        metadata: {
          reviewId: 2,
          publicationId: 2,
          publicationTitle: 'Machine Learning en Medicina',
          fechaInicio: '2024-01-20T14:30:00Z'
        },
        relacionadoCon: {
          tipo: 'review',
          id: '2',
          titulo: 'Machine Learning en Medicina'
        }
      },
      {
        id: 8,
        titulo: 'Nueva publicación disponible',
        mensaje: 'Se ha publicado una nueva investigación: "Avances en Blockchain y Criptomonedas"',
        tipo: 'NEW_PUBLICATION_AVAILABLE',
        categoria: 'PUBLICATION',
        prioridad: 'BAJA',
        leida: false,
        urgente: false,
        fechaCreacion: '2024-01-21T10:30:00Z',
        usuario: {
          id: 5,
          nombres: 'Pedro',
          apellidos: 'Lector',
          email: 'lector@test.com'
        },
        accion: 'LEER_PUBLICACION',
        urlAccion: '/catalog',
        icono: 'BookOpen',
        color: 'indigo',
        metadata: {
          publicationId: 3,
          publicationTitle: 'Avances en Blockchain y Criptomonedas'
        },
        relacionadoCon: {
          tipo: 'publication',
          id: '3',
          titulo: 'Avances en Blockchain y Criptomonedas'
        }
      },
      {
        id: 8,
        titulo: 'Backup del sistema completado',
        mensaje: 'El backup automático del sistema se ha completado exitosamente. Datos respaldados hasta las 02:00 AM.',
        tipo: 'BACKUP_CREATED',
        categoria: 'BACKUP',
        prioridad: 'BAJA',
        leida: true,
        urgente: false,
        fechaCreacion: '2024-01-22T02:15:00Z',
        usuario: {
          id: 4,
          nombres: 'Ana',
          apellidos: 'Administradora',
          email: 'admin@test.com'
        },
        accion: 'VER_BACKUPS',
        urlAccion: '/admin/settings',
        icono: 'Database',
        color: 'gray',
        metadata: {
          backupId: 'backup_20240122_020000',
          backupSize: '2.5 MB',
          backupType: 'AUTOMATIC'
        },
        relacionadoCon: {
          tipo: 'system',
          id: 'backup_20240122_020000',
          titulo: 'Backup del Sistema'
        }
      },
      {
        id: 9,
        titulo: 'Revisión completada',
        mensaje: 'La revisión de "Machine Learning en Medicina" ha sido completada por María Revisora.',
        tipo: 'REVIEW_COMPLETED',
        categoria: 'REVIEW',
        prioridad: 'MEDIA',
        leida: false,
        urgente: false,
        fechaCreacion: '2024-01-23T14:20:00Z',
        usuario: {
          id: 3,
          nombres: 'Carlos',
          apellidos: 'Editor',
          email: 'editor@test.com'
        },
        accion: 'REVISAR_DECISION',
        urlAccion: '/admin/editorial',
        icono: 'CheckCircle',
        color: 'green',
        metadata: {
          reviewId: 2,
          publicationId: 2,
          publicationTitle: 'Machine Learning en Medicina',
          reviewerName: 'María Revisora'
        },
        relacionadoCon: {
          tipo: 'review',
          id: '2',
          titulo: 'Machine Learning en Medicina'
        }
      },
      {
        id: 10,
        titulo: 'Alerta de seguridad',
        mensaje: 'Se detectaron múltiples intentos de inicio de sesión fallidos desde la IP 192.168.1.100',
        tipo: 'SECURITY_ALERT',
        categoria: 'SECURITY',
        prioridad: 'URGENT',
        leida: false,
        urgente: true,
        fechaCreacion: '2024-01-24T09:45:00Z',
        usuario: {
          id: 4,
          nombres: 'Ana',
          apellidos: 'Administradora',
          email: 'admin@test.com'
        },
        accion: 'INVESTIGAR',
        urlAccion: '/admin/audit',
        icono: 'Shield',
        color: 'red',
        metadata: {
          ipAddress: '192.168.1.100',
          failedAttempts: 5,
          targetUser: 'autor@test.com'
        },
        relacionadoCon: {
          tipo: 'system',
          id: 'security_alert_001',
          titulo: 'Alerta de Seguridad'
        }
      }
    ],
    categories: [
      { id: 1, nombre: 'Tecnología', descripcion: 'Artículos sobre tecnología e innovación' },
      { id: 2, nombre: 'Medicina', descripcion: 'Investigaciones médicas y de salud' },
      { id: 3, nombre: 'Finanzas', descripcion: 'Estudios sobre economía y finanzas' },
      { id: 4, nombre: 'Educación', descripcion: 'Investigaciones en educación' },
      { id: 5, nombre: 'Ciencias Sociales', descripcion: 'Estudios sociales y humanidades' }
    ],
    tags: [
      'IA', 'Machine Learning', 'Tecnología', 'Innovación', 'Medicina', 'Diagnóstico', 
      'Salud', 'Blockchain', 'Criptomonedas', 'Finanzas', 'Educación', 'Investigación'
    ]
  };

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  private initializeData() {
    // Inicializar datos en localStorage si no existen
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('mock_users')) {
        localStorage.setItem('mock_users', JSON.stringify(this.mockData.users));
      }
      if (!localStorage.getItem('mock_publications')) {
        localStorage.setItem('mock_publications', JSON.stringify(this.mockData.publications));
      }
      if (!localStorage.getItem('mock_reviews')) {
        localStorage.setItem('mock_reviews', JSON.stringify(this.mockData.reviews));
      }
      if (!localStorage.getItem('mock_notifications')) {
        localStorage.setItem('mock_notifications', JSON.stringify(this.mockData.notifications));
      }
      if (!localStorage.getItem('mock_categories')) {
        localStorage.setItem('mock_categories', JSON.stringify(this.mockData.categories));
      }
      if (!localStorage.getItem('mock_tags')) {
        localStorage.setItem('mock_tags', JSON.stringify(this.mockData.tags));
      }
    }
  }

  // Métodos para usuarios
  getUsers() {
    if (typeof window !== 'undefined') {
      const users = localStorage.getItem('mock_users');
      return users ? JSON.parse(users) : this.mockData.users;
    }
    return this.mockData.users;
  }

  saveUsers(users: any[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
  }

  addUser(user: any) {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: Date.now(),
      fechaRegistro: new Date().toISOString(),
      activo: true
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateUser(id: number, userData: any) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      this.saveUsers(users);
      return users[index];
    }
    return null;
  }

  deleteUser(id: number) {
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    this.saveUsers(filteredUsers);
  }

  // Métodos para publicaciones
  getPublications() {
    if (typeof window !== 'undefined') {
      const publications = localStorage.getItem('mock_publications');
      return publications ? JSON.parse(publications) : this.mockData.publications;
    }
    return this.mockData.publications;
  }

  savePublications(publications: any[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_publications', JSON.stringify(publications));
    }
  }

  addPublication(publication: any) {
    const publications = this.getPublications();
    const newPublication = {
      ...publication,
      id: Date.now(),
      estado: publication.estado || 'BORRADOR',
      fechaCreacion: new Date().toISOString(),
      citaciones: 0,
      descargas: 0,
      vistas: 0,
      version: '1.0',
      idioma: 'es',
      licencia: 'CC BY 4.0'
    };
    publications.push(newPublication);
    this.savePublications(publications);
    return newPublication;
  }

  updatePublication(id: number, publicationData: any) {
    const publications = this.getPublications();
    const index = publications.findIndex(p => p.id === id);
    if (index !== -1) {
      publications[index] = { ...publications[index], ...publicationData };
      this.savePublications(publications);
      return publications[index];
    }
    return null;
  }

  deletePublication(id: number) {
    const publications = this.getPublications();
    const filteredPublications = publications.filter(p => p.id !== id);
    this.savePublications(filteredPublications);
  }

  // Métodos para revisiones
  getReviews() {
    if (typeof window !== 'undefined') {
      const reviews = localStorage.getItem('mock_reviews');
      return reviews ? JSON.parse(reviews) : this.mockData.reviews;
    }
    return this.mockData.reviews;
  }

  saveReviews(reviews: any[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_reviews', JSON.stringify(reviews));
    }
  }

  addReview(review: any) {
    const reviews = this.getReviews();
    const newReview = {
      ...review,
      id: Date.now(),
      fechaAsignacion: new Date().toISOString(),
      estado: 'PENDIENTE',
      comentarios: null,
      recomendacion: null,
      puntuacion: null,
      aspectosEvaluados: [],
      tiempoRevision: 0,
      confidencial: false,
      version: '1.0'
    };
    reviews.push(newReview);
    this.saveReviews(reviews);
    return newReview;
  }

  updateReview(id: number, reviewData: any) {
    const reviews = this.getReviews();
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews[index] = { ...reviews[index], ...reviewData };
      this.saveReviews(reviews);
      return reviews[index];
    }
    return null;
  }

  deleteReview(id: number) {
    const reviews = this.getReviews();
    const filteredReviews = reviews.filter(r => r.id !== id);
    this.saveReviews(filteredReviews);
  }

  // Métodos para notificaciones
  getNotifications() {
    if (typeof window !== 'undefined') {
      const notifications = localStorage.getItem('mock_notifications');
      return notifications ? JSON.parse(notifications) : this.mockData.notifications;
    }
    return this.mockData.notifications;
  }

  saveNotifications(notifications: any[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_notifications', JSON.stringify(notifications));
    }
  }

  addNotification(notification: any) {
    const notifications = this.getNotifications();
    const newNotification = {
      ...notification,
      id: Date.now(),
      fechaCreacion: new Date().toISOString(),
      leida: false,
      urgente: false
    };
    notifications.push(newNotification);
    this.saveNotifications(notifications);
    return newNotification;
  }

  updateNotification(id: number, notificationData: any) {
    const notifications = this.getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index] = { ...notifications[index], ...notificationData };
      this.saveNotifications(notifications);
      return notifications[index];
    }
    return null;
  }

  deleteNotification(id: number) {
    const notifications = this.getNotifications();
    const filteredNotifications = notifications.filter(n => n.id !== id);
    this.saveNotifications(filteredNotifications);
  }

  // Métodos para categorías
  getCategories() {
    if (typeof window !== 'undefined') {
      const categories = localStorage.getItem('mock_categories');
      return categories ? JSON.parse(categories) : this.mockData.categories;
    }
    return this.mockData.categories;
  }

  // Métodos para tags
  getTags() {
    if (typeof window !== 'undefined') {
      const tags = localStorage.getItem('mock_tags');
      return tags ? JSON.parse(tags) : this.mockData.tags;
    }
    return this.mockData.tags;
  }

  // Métodos de búsqueda y filtrado
  searchPublications(query: string) {
    const publications = this.getPublications();
    return publications.filter(p => 
      p.titulo.toLowerCase().includes(query.toLowerCase()) ||
      p.resumen.toLowerCase().includes(query.toLowerCase()) ||
      p.palabrasClave.some((keyword: string) => 
        keyword.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  getPublicationsByCategory(category: string) {
    const publications = this.getPublications();
    return publications.filter(p => 
      p.categoria.toLowerCase() === category.toLowerCase()
    );
  }

  getPublicationsByStatus(status: string) {
    const publications = this.getPublications();
    return publications.filter(p => 
      p.estado && p.estado.toLowerCase() === status.toLowerCase()
    );
  }

  getMyPublications(userEmail: string) {
    const publications = this.getPublications();
    return publications.filter(p => 
      p.autor && p.autor.email === userEmail
    );
  }

  getMyReviews(userEmail: string) {
    const reviews = this.getReviews();
    return reviews.filter(r => 
      r.revisor && r.revisor.email === userEmail
    );
  }

  getMyNotifications(userEmail: string) {
    const notifications = this.getNotifications();
    return notifications.filter(n => 
      n.usuario && n.usuario.email === userEmail
    );
  }

  // Métodos de estadísticas
  getPublicationStats() {
    const publications = this.getPublications();
    return {
      total: publications.length,
      byStatus: publications.reduce((acc: any, pub: any) => {
        acc[pub.estado] = (acc[pub.estado] || 0) + 1;
        return acc;
      }, {}),
      byCategory: publications.reduce((acc: any, pub: any) => {
        acc[pub.categoria] = (acc[pub.categoria] || 0) + 1;
        return acc;
      }, {}),
      byType: publications.reduce((acc: any, pub: any) => {
        acc[pub.tipo] = (acc[pub.tipo] || 0) + 1;
        return acc;
      }, {}),
      totalCitations: publications.reduce((sum: number, pub: any) => sum + (pub.citaciones || 0), 0),
      totalDownloads: publications.reduce((sum: number, pub: any) => sum + (pub.descargas || 0), 0),
      totalViews: publications.reduce((sum: number, pub: any) => sum + (pub.vistas || 0), 0)
    };
  }

  getReviewStats() {
    const reviews = this.getReviews();
    return {
      total: reviews.length,
      byStatus: reviews.reduce((acc: any, review: any) => {
        acc[review.estado] = (acc[review.estado] || 0) + 1;
        return acc;
      }, {}),
      byRecommendation: reviews.reduce((acc: any, review: any) => {
        if (review.recomendacion) {
          acc[review.recomendacion] = (acc[review.recomendacion] || 0) + 1;
        }
        return acc;
      }, {}),
      averageScore: reviews
        .filter((r: any) => r.puntuacion)
        .reduce((sum: number, r: any) => sum + r.puntuacion, 0) / 
        reviews.filter((r: any) => r.puntuacion).length || 0,
      averageTime: reviews
        .filter((r: any) => r.tiempoRevision)
        .reduce((sum: number, r: any) => sum + r.tiempoRevision, 0) / 
        reviews.filter((r: any) => r.tiempoRevision).length || 0
    };
  }

  getNotificationStats(userEmail: string) {
    const notifications = this.getMyNotifications(userEmail);
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.leida).length,
      urgent: notifications.filter(n => n.urgente).length,
      byType: notifications.reduce((acc: any, n: any) => {
        acc[n.tipo] = (acc[n.tipo] || 0) + 1;
        return acc;
      }, {}),
      byPriority: notifications.reduce((acc: any, n: any) => {
        acc[n.prioridad] = (acc[n.prioridad] || 0) + 1;
        return acc;
      }, {})
    };
  }

  // Métodos de simulación de flujo real
  simulatePublicationWorkflow(publicationId: number) {
    const publications = this.getPublications();
    const publication = publications.find(p => p.id === publicationId);
    
    if (publication) {
      // Simular incremento de vistas
      publication.vistas += Math.floor(Math.random() * 10) + 1;
      
      // Simular descargas ocasionales
      if (Math.random() < 0.1) {
        publication.descargas += 1;
      }
      
      // Simular citaciones ocasionales
      if (Math.random() < 0.05) {
        publication.citaciones += 1;
      }
      
      this.savePublications(publications);
    }
  }

  simulateReviewProcess(reviewId: number) {
    const reviews = this.getReviews();
    const review = reviews.find(r => r.id === reviewId);
    
    if (review && review.estado === 'PENDIENTE') {
      // Simular progreso en la revisión
      const progress = Math.random();
      
      if (progress < 0.3) {
        review.estado = 'EN_PROGRESO';
        review.tiempoRevision += 2;
      } else if (progress < 0.7) {
        review.estado = 'COMPLETADA';
        review.fechaCompletado = new Date().toISOString();
        review.tiempoRevision += 8;
        review.puntuacion = Math.floor(Math.random() * 2) + 4; // 4-5
        review.recomendacion = ['APROBAR', 'CAMBIOS_MINOR', 'CAMBIOS_MAJOR'][Math.floor(Math.random() * 3)];
      }
      
      this.saveReviews(reviews);
    }
  }

  // Métodos de limpieza y reset
  resetToDefaults() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_users', JSON.stringify(this.mockData.users));
      localStorage.setItem('mock_publications', JSON.stringify(this.mockData.publications));
      localStorage.setItem('mock_reviews', JSON.stringify(this.mockData.reviews));
      localStorage.setItem('mock_notifications', JSON.stringify(this.mockData.notifications));
      localStorage.setItem('mock_categories', JSON.stringify(this.mockData.categories));
      localStorage.setItem('mock_tags', JSON.stringify(this.mockData.tags));
    }
  }

  clearAllData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_users');
      localStorage.removeItem('mock_publications');
      localStorage.removeItem('mock_reviews');
      localStorage.removeItem('mock_notifications');
      localStorage.removeItem('mock_categories');
      localStorage.removeItem('mock_tags');
    }
  }

  // Métodos de exportación/importación
  exportData() {
    return {
      users: this.getUsers(),
      publications: this.getPublications(),
      reviews: this.getReviews(),
      notifications: this.getNotifications(),
      categories: this.getCategories(),
      tags: this.getTags(),
      exportDate: new Date().toISOString()
    };
  }

  importData(data: any) {
    if (data.users) this.saveUsers(data.users);
    if (data.publications) this.savePublications(data.publications);
    if (data.reviews) this.saveReviews(data.reviews);
    if (data.notifications) this.saveNotifications(data.notifications);
    if (data.categories) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock_categories', JSON.stringify(data.categories));
      }
    }
    if (data.tags) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock_tags', JSON.stringify(data.tags));
      }
    }
  }
}

export const mockDataService = MockDataService.getInstance();
