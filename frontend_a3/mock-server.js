const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(__dirname, 'data', 'backups');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PUBLICATIONS_FILE = path.join(DATA_DIR, 'publications.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Data management functions
function loadData(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
  }
  return defaultValue;
}

function saveData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving data to ${filePath}:`, error);
    return false;
  }
}

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  const files = [
    { source: USERS_FILE, dest: path.join(backupPath, 'users.json') },
    { source: PUBLICATIONS_FILE, dest: path.join(backupPath, 'publications.json') },
    { source: REVIEWS_FILE, dest: path.join(backupPath, 'reviews.json') },
    { source: NOTIFICATIONS_FILE, dest: path.join(backupPath, 'notifications.json') }
  ];

  files.forEach(({ source, dest }) => {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
    }
  });

  console.log(`Backup created: ${backupPath}`);
  return backupPath;
}

function initializeDefaultData() {
  // Initialize users if file doesn't exist
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: 1,
        username: 'autor',
        password: 'password',
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'autor@example.com',
        roles: ['ROLE_AUTOR'],
        afiliacion: 'Universidad Nacional',
        orcid: '0000-0000-0000-0001',
        biografia: 'Investigador en ciencias computacionales'
      },
      {
        id: 2,
        username: 'revisor',
        password: 'password',
        nombres: 'María',
        apellidos: 'García',
        email: 'revisor@example.com',
        roles: ['ROLE_REVISOR'],
        afiliacion: 'Instituto de Investigación',
        orcid: '0000-0000-0000-0002',
        biografia: 'Experta en revisión de publicaciones académicas'
      },
      {
        id: 3,
        username: 'editor',
        password: 'password',
        nombres: 'Carlos',
        apellidos: 'López',
        email: 'editor@example.com',
        roles: ['ROLE_EDITOR'],
        afiliacion: 'Editorial Académica',
        orcid: '0000-0000-0000-0003',
        biografia: 'Editor jefe de publicaciones científicas'
      },
      {
        id: 4,
        username: 'admin',
        password: 'password',
        nombres: 'Ana',
        apellidos: 'Rodríguez',
        email: 'admin@example.com',
        roles: ['ROLE_ADMIN'],
        afiliacion: 'Sistema de Gestión',
        orcid: '0000-0000-0000-0004',
        biografia: 'Administradora del sistema'
      },
      {
        id: 5,
        username: 'lector',
        password: 'password',
        nombres: 'Pedro',
        apellidos: 'Martínez',
        email: 'lector@example.com',
        roles: ['ROLE_LECTOR'],
        afiliacion: 'Comunidad Académica',
        orcid: '0000-0000-0000-0005',
        biografia: 'Lector de publicaciones académicas'
      }
    ];
    saveData(USERS_FILE, defaultUsers);
  }

  // Initialize publications if file doesn't exist
  if (!fs.existsSync(PUBLICATIONS_FILE)) {
    const defaultPublications = [
      {
        id: 1,
        titulo: 'Análisis de Algoritmos de Machine Learning',
        resumen: 'Estudio comparativo de algoritmos de machine learning para clasificación de datos',
        tipo: 'ARTICULO',
        estado: 'PUBLICADO',
        autorId: 1,
        autor: 'Juan Pérez',
        fechaCreacion: '2024-01-15T10:00:00Z',
        fechaPublicacion: '2024-02-01T10:00:00Z',
        palabrasClave: ['machine learning', 'algoritmos', 'clasificación'],
        referencias: ['Referencia 1', 'Referencia 2'],
        metadata: {
          doi: '10.1000/example.2024.001',
          issn: '1234-5678',
          volumen: 1,
          numero: 1,
          paginas: '1-15'
        }
      },
      {
        id: 2,
        titulo: 'Fundamentos de Programación Web',
        resumen: 'Guía completa de desarrollo web moderno',
        tipo: 'LIBRO',
        estado: 'EN_REVISION',
        autorId: 1,
        autor: 'Juan Pérez',
        fechaCreacion: '2024-01-20T10:00:00Z',
        isbn: '978-0-123456-78-9',
        numeroPaginas: 350,
        edicion: 1,
        capitulos: [
          { titulo: 'Introducción a HTML', numero: 1, paginas: '1-25' },
          { titulo: 'CSS Avanzado', numero: 2, paginas: '26-50' },
          { titulo: 'JavaScript Moderno', numero: 3, paginas: '51-75' }
        ]
      }
    ];
    saveData(PUBLICATIONS_FILE, defaultPublications);
  }

  // Initialize reviews if file doesn't exist
  if (!fs.existsSync(REVIEWS_FILE)) {
    const defaultReviews = [
      {
        id: 1,
        publicacionId: 2,
        publicacionTitulo: 'Fundamentos de Programación Web',
        revisorId: 2,
        revisor: 'María García',
        estado: 'EN_PROCESO',
        fechaAsignacion: '2024-01-25T10:00:00Z',
        fechaInicio: '2024-01-26T10:00:00Z',
        prioridad: 'ALTA',
        recomendacion: null,
        comentarios: []
      }
    ];
    saveData(REVIEWS_FILE, defaultReviews);
  }

  // Initialize notifications if file doesn't exist
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    const defaultNotifications = [
      {
        id: 1,
        usuarioId: 1,
        tipo: 'REVISION_ASIGNADA',
        titulo: 'Nueva revisión asignada',
        mensaje: 'Se te ha asignado una nueva revisión: "Fundamentos de Programación Web"',
        estado: 'NO_LEIDA',
        prioridad: 'ALTA',
        fechaCreacion: '2024-01-25T10:00:00Z',
        leida: false
      },
      {
        id: 2,
        usuarioId: 2,
        tipo: 'PUBLICACION_ENVIADA',
        titulo: 'Nueva publicación para revisar',
        mensaje: 'Una nueva publicación requiere tu revisión',
        estado: 'NO_LEIDA',
        prioridad: 'MEDIA',
        fechaCreacion: '2024-01-24T10:00:00Z',
        leida: false
      }
    ];
    saveData(NOTIFICATIONS_FILE, defaultNotifications);
  }
}

// Initialize data
initializeDefaultData();

// Load current data
let users = loadData(USERS_FILE);
let publications = loadData(PUBLICATIONS_FILE);
let reviews = loadData(REVIEWS_FILE);
let notifications = loadData(NOTIFICATIONS_FILE);

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      roles: user.roles,
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Helper function to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Helper function to get next ID
function getNextId(collection) {
  return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
}

// Helper function to save and backup data
function saveAndBackup(data, filePath, collection) {
  collection.length = 0;
  collection.push(...data);
  
  if (saveData(filePath, data)) {
    // Create backup every 10 operations
    const backupCount = Math.floor(Math.random() * 10);
    if (backupCount === 0) {
      createBackup();
    }
    return true;
  }
  return false;
}

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    accessToken: token,
    refreshToken: refreshToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
    username: user.username,
    roles: user.roles,
    nombres: user.nombres,
    apellidos: user.apellidos,
    email: user.email,
    afiliacion: user.afiliacion,
    orcid: user.orcid,
    biografia: user.biografia
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, nombres, apellidos, email, afiliacion, orcid, biografia } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = {
    id: getNextId(users),
    username,
    password,
    nombres,
    apellidos,
    email,
    roles: ['ROLE_AUTOR'], // Default role
    afiliacion,
    orcid,
    biografia
  };

  users.push(newUser);
  saveAndBackup(users, USERS_FILE, users);

  const token = generateToken(newUser);
  const refreshToken = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    accessToken: token,
    refreshToken: refreshToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
    username: newUser.username,
    roles: newUser.roles,
    nombres: newUser.nombres,
    apellidos: newUser.apellidos,
    email: newUser.email,
    afiliacion: newUser.afiliacion,
    orcid: newUser.orcid,
    biografia: newUser.biografia
  });
});

app.post('/api/auth/refresh', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const token = generateToken(user);
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    accessToken: token,
    refreshToken: refreshToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
    username: user.username,
    roles: user.roles,
    nombres: user.nombres,
    apellidos: user.apellidos,
    email: user.email,
    afiliacion: user.afiliacion,
    orcid: user.orcid,
    biografia: user.biografia
  });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    nombres: user.nombres,
    apellidos: user.apellidos,
    email: user.email,
    roles: user.roles,
    afiliacion: user.afiliacion,
    orcid: user.orcid,
    biografia: user.biografia
  });
});

// Publications endpoints
app.get('/api/publicaciones', (req, res) => {
  const { page = 0, size = 10, estado, tipo, titulo } = req.query;
  
  let filteredPublications = [...publications];
  
  if (estado) {
    filteredPublications = filteredPublications.filter(p => p.estado === estado);
  }
  
  if (tipo) {
    filteredPublications = filteredPublications.filter(p => p.tipo === tipo);
  }
  
  if (titulo) {
    filteredPublications = filteredPublications.filter(p => 
      p.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  }

  const start = page * size;
  const end = start + parseInt(size);
  const paginatedPublications = filteredPublications.slice(start, end);

  res.json({
    content: paginatedPublications,
    totalElements: filteredPublications.length,
    totalPages: Math.ceil(filteredPublications.length / size),
    size: parseInt(size),
    number: parseInt(page)
  });
});

app.get('/api/publicaciones/mis-publicaciones', verifyToken, (req, res) => {
  const userPublications = publications.filter(p => p.autorId === req.user.id);
  
  res.json({
    content: userPublications,
    totalElements: userPublications.length,
    totalPages: 1,
    size: userPublications.length,
    number: 0
  });
});

app.post('/api/publicaciones', verifyToken, (req, res) => {
  const newPublication = {
    id: getNextId(publications),
    ...req.body,
    autorId: req.user.id,
    autor: `${req.user.nombres} ${req.user.apellidos}`,
    fechaCreacion: new Date().toISOString(),
    estado: 'BORRADOR'
  };

  publications.push(newPublication);
  saveAndBackup(publications, PUBLICATIONS_FILE, publications);

  // Create notification for editors
  const editorUsers = users.filter(u => u.roles.includes('ROLE_EDITOR'));
  editorUsers.forEach(editor => {
    const notification = {
      id: getNextId(notifications),
      usuarioId: editor.id,
      tipo: 'NUEVA_PUBLICACION',
      titulo: 'Nueva publicación creada',
      mensaje: `Se ha creado una nueva publicación: "${newPublication.titulo}"`,
      estado: 'NO_LEIDA',
      prioridad: 'MEDIA',
      fechaCreacion: new Date().toISOString(),
      leida: false
    };
    notifications.push(notification);
  });
  saveAndBackup(notifications, NOTIFICATIONS_FILE, notifications);

  res.status(201).json(newPublication);
});

app.put('/api/publicaciones/:id', verifyToken, (req, res) => {
  const publicationId = parseInt(req.params.id);
  const publicationIndex = publications.findIndex(p => p.id === publicationId);
  
  if (publicationIndex === -1) {
    return res.status(404).json({ message: 'Publication not found' });
  }

  // Check if user is the author or has admin/editor role
  const publication = publications[publicationIndex];
  const isAuthor = publication.autorId === req.user.id;
  const isAdmin = req.user.roles.includes('ROLE_ADMIN');
  const isEditor = req.user.roles.includes('ROLE_EDITOR');

  if (!isAuthor && !isAdmin && !isEditor) {
    return res.status(403).json({ message: 'Not authorized to edit this publication' });
  }

  publications[publicationIndex] = {
    ...publications[publicationIndex],
    ...req.body,
    id: publicationId // Ensure ID doesn't change
  };

  saveAndBackup(publications, PUBLICATIONS_FILE, publications);
  res.json(publications[publicationIndex]);
});

app.delete('/api/publicaciones/:id', verifyToken, (req, res) => {
  const publicationId = parseInt(req.params.id);
  const publicationIndex = publications.findIndex(p => p.id === publicationId);
  
  if (publicationIndex === -1) {
    return res.status(404).json({ message: 'Publication not found' });
  }

  const publication = publications[publicationIndex];
  const isAuthor = publication.autorId === req.user.id;
  const isAdmin = req.user.roles.includes('ROLE_ADMIN');

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to delete this publication' });
  }

  publications.splice(publicationIndex, 1);
  saveAndBackup(publications, PUBLICATIONS_FILE, publications);

  // Remove associated reviews
  const reviewsToRemove = reviews.filter(r => r.publicacionId === publicationId);
  reviewsToRemove.forEach(review => {
    const reviewIndex = reviews.findIndex(r => r.id === review.id);
    if (reviewIndex !== -1) {
      reviews.splice(reviewIndex, 1);
    }
  });
  saveAndBackup(reviews, REVIEWS_FILE, reviews);

  res.json({ message: 'Publication deleted successfully' });
});

// Reviews endpoints
app.get('/api/reviews/mis-reviews', verifyToken, (req, res) => {
  const userReviews = reviews.filter(r => r.revisorId === req.user.id);
  
  res.json({
    content: userReviews,
    totalElements: userReviews.length,
    totalPages: 1,
    size: userReviews.length,
    number: 0
  });
});

app.post('/api/reviews', verifyToken, (req, res) => {
  const { publicacionId, prioridad = 'MEDIA' } = req.body;
  
  const publication = publications.find(p => p.id === publicacionId);
  if (!publication) {
    return res.status(404).json({ message: 'Publication not found' });
  }

  const newReview = {
    id: getNextId(reviews),
    publicacionId,
    publicacionTitulo: publication.titulo,
    revisorId: req.user.id,
    revisor: `${req.user.nombres} ${req.user.apellidos}`,
    estado: 'ASIGNADA',
    fechaAsignacion: new Date().toISOString(),
    prioridad,
    recomendacion: null,
    comentarios: []
  };

  reviews.push(newReview);
  saveAndBackup(reviews, REVIEWS_FILE, reviews);

  // Create notification for the author
  const notification = {
    id: getNextId(notifications),
    usuarioId: publication.autorId,
    tipo: 'REVISION_ASIGNADA',
    titulo: 'Nueva revisión asignada',
    mensaje: `Se ha asignado una revisión para tu publicación: "${publication.titulo}"`,
    estado: 'NO_LEIDA',
    prioridad: 'ALTA',
    fechaCreacion: new Date().toISOString(),
    leida: false
  };
  notifications.push(notification);
  saveAndBackup(notifications, NOTIFICATIONS_FILE, notifications);

  res.status(201).json(newReview);
});

app.put('/api/reviews/:id', verifyToken, (req, res) => {
  const reviewId = parseInt(req.params.id);
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  
  if (reviewIndex === -1) {
    return res.status(404).json({ message: 'Review not found' });
  }

  const review = reviews[reviewIndex];
  if (review.revisorId !== req.user.id && !req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Not authorized to edit this review' });
  }

  reviews[reviewIndex] = {
    ...reviews[reviewIndex],
    ...req.body,
    id: reviewId
  };

  saveAndBackup(reviews, REVIEWS_FILE, reviews);
  res.json(reviews[reviewIndex]);
});

// Notifications endpoints
app.get('/api/notificaciones/mis-notificaciones', verifyToken, (req, res) => {
  const userNotifications = notifications.filter(n => n.usuarioId === req.user.id);
  
  res.json({
    content: userNotifications,
    totalElements: userNotifications.length,
    totalPages: 1,
    size: userNotifications.length,
    number: 0
  });
});

app.put('/api/notificaciones/:id/leer', verifyToken, (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notificationIndex = notifications.findIndex(n => n.id === notificationId);
  
  if (notificationIndex === -1) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  const notification = notifications[notificationIndex];
  if (notification.usuarioId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to read this notification' });
  }

  notifications[notificationIndex] = {
    ...notification,
    leida: true,
    estado: 'LEIDA'
  };

  saveAndBackup(notifications, NOTIFICATIONS_FILE, notifications);
  res.json(notifications[notificationIndex]);
});

app.get('/api/notificaciones/unread-count', verifyToken, (req, res) => {
  const unreadCount = notifications.filter(n => 
    n.usuarioId === req.user.id && !n.leida
  ).length;
  
  res.json({ count: unreadCount });
});

// Dashboard statistics
app.get('/api/dashboard/stats', verifyToken, (req, res) => {
  const userPublications = publications.filter(p => p.autorId === req.user.id);
  const userReviews = reviews.filter(r => r.revisorId === req.user.id);
  const userNotifications = notifications.filter(n => n.usuarioId === req.user.id);

  const stats = {
    totalPublications: userPublications.length,
    publishedPublications: userPublications.filter(p => p.estado === 'PUBLICADO').length,
    draftPublications: userPublications.filter(p => p.estado === 'BORRADOR').length,
    inReviewPublications: userPublications.filter(p => p.estado === 'EN_REVISION').length,
    totalReviews: userReviews.length,
    completedReviews: userReviews.filter(r => r.estado === 'COMPLETADA').length,
    pendingReviews: userReviews.filter(r => r.estado === 'EN_PROCESO').length,
    unreadNotifications: userNotifications.filter(n => !n.leida).length,
    totalNotifications: userNotifications.length
  };

  res.json(stats);
});

// Admin endpoints
app.get('/api/admin/users', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  res.json({
    content: users,
    totalElements: users.length,
    totalPages: 1,
    size: users.length,
    number: 0
  });
});

app.put('/api/admin/users/:id', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    id: userId
  };

  saveAndBackup(users, USERS_FILE, users);
  res.json(users[userIndex]);
});

// Backup management
app.post('/api/admin/backup', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const backupPath = createBackup();
  res.json({ message: 'Backup created successfully', path: backupPath });
});

app.get('/api/admin/backups', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const backupFolders = fs.readdirSync(BACKUP_DIR)
      .filter(folder => folder.startsWith('backup-'))
      .map(folder => ({
        name: folder,
        path: path.join(BACKUP_DIR, folder),
        date: folder.replace('backup-', '').replace(/-/g, ':').replace('T', ' ').replace('Z', ''),
        files: fs.readdirSync(path.join(BACKUP_DIR, folder))
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(backupFolders);
  } catch (error) {
    res.status(500).json({ message: 'Error reading backups' });
  }
});

// Restore backup functionality
app.post('/api/admin/backup/restore/:backupName', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const backupName = req.params.backupName;
  const backupPath = path.join(BACKUP_DIR, backupName);

  if (!fs.existsSync(backupPath)) {
    return res.status(404).json({ message: 'Backup not found' });
  }

  try {
    // Create current state backup before restoring
    const currentBackup = createBackup();
    
    // Restore files from backup
    const files = [
      { source: path.join(backupPath, 'users.json'), dest: USERS_FILE },
      { source: path.join(backupPath, 'publications.json'), dest: PUBLICATIONS_FILE },
      { source: path.join(backupPath, 'reviews.json'), dest: REVIEWS_FILE },
      { source: path.join(backupPath, 'notifications.json'), dest: NOTIFICATIONS_FILE }
    ];

    files.forEach(({ source, dest }) => {
      if (fs.existsSync(source)) {
        fs.copyFileSync(source, dest);
      }
    });

    // Reload data in memory
    users = loadData(USERS_FILE);
    publications = loadData(PUBLICATIONS_FILE);
    reviews = loadData(REVIEWS_FILE);
    notifications = loadData(NOTIFICATIONS_FILE);

    res.json({ 
      message: 'Backup restored successfully', 
      restoredBackup: backupName,
      currentBackup: currentBackup
    });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring backup' });
  }
});

// Delete backup functionality
app.delete('/api/admin/backup/:backupName', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const backupName = req.params.backupName;
  const backupPath = path.join(BACKUP_DIR, backupName);

  if (!fs.existsSync(backupPath)) {
    return res.status(404).json({ message: 'Backup not found' });
  }

  try {
    // Remove backup directory and all contents
    fs.rmSync(backupPath, { recursive: true, force: true });
    res.json({ message: 'Backup deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting backup' });
  }
});

// Export data functionality
app.post('/api/admin/export', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { format = 'json' } = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  try {
    const exportData = {
      users,
      publications,
      reviews,
      notifications,
      exportDate: new Date().toISOString(),
      exportBy: req.user.username
    };

    if (format === 'json') {
      const exportPath = path.join(DATA_DIR, `export-${timestamp}.json`);
      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
      res.json({ 
        message: 'Data exported successfully', 
        file: `export-${timestamp}.json`,
        path: exportPath
      });
    } else {
      res.status(400).json({ message: 'Unsupported format' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error exporting data' });
  }
});

// Import data functionality
app.post('/api/admin/import', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { data } = req.body;
  
  if (!data || !data.users || !data.publications || !data.reviews || !data.notifications) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    // Create backup before import
    const backupPath = createBackup();
    
    // Save imported data
    saveData(USERS_FILE, data.users);
    saveData(PUBLICATIONS_FILE, data.publications);
    saveData(REVIEWS_FILE, data.reviews);
    saveData(NOTIFICATIONS_FILE, data.notifications);

    // Reload data in memory
    users = loadData(USERS_FILE);
    publications = loadData(PUBLICATIONS_FILE);
    reviews = loadData(REVIEWS_FILE);
    notifications = loadData(NOTIFICATIONS_FILE);

    res.json({ 
      message: 'Data imported successfully',
      backupCreated: backupPath
    });
  } catch (error) {
    res.status(500).json({ message: 'Error importing data' });
  }
});

// System statistics
app.get('/api/admin/stats', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const stats = {
      users: {
        total: users.length,
        byRole: users.reduce((acc, user) => {
          user.roles.forEach(role => {
            acc[role] = (acc[role] || 0) + 1;
          });
          return acc;
        }, {})
      },
      publications: {
        total: publications.length,
        byStatus: publications.reduce((acc, pub) => {
          acc[pub.estado] = (acc[pub.estado] || 0) + 1;
          return acc;
        }, {}),
        byType: publications.reduce((acc, pub) => {
          acc[pub.tipo] = (acc[pub.tipo] || 0) + 1;
          return acc;
        }, {})
      },
      reviews: {
        total: reviews.length,
        byStatus: reviews.reduce((acc, review) => {
          acc[review.estado] = (acc[review.estado] || 0) + 1;
          return acc;
        }, {})
      },
      notifications: {
        total: notifications.length,
        unread: notifications.filter(n => !n.leida).length,
        byType: notifications.reduce((acc, notif) => {
          acc[notif.tipo] = (acc[notif.tipo] || 0) + 1;
          return acc;
        }, {})
      },
      backups: {
        total: fs.readdirSync(BACKUP_DIR).filter(folder => folder.startsWith('backup-')).length,
        latest: fs.readdirSync(BACKUP_DIR)
          .filter(folder => folder.startsWith('backup-'))
          .sort()
          .pop()
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        dataFiles: {
          users: fs.existsSync(USERS_FILE),
          publications: fs.existsSync(PUBLICATIONS_FILE),
          reviews: fs.existsSync(REVIEWS_FILE),
          notifications: fs.existsSync(NOTIFICATIONS_FILE)
        }
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error getting system statistics' });
  }
});

// Clean old backups
app.post('/api/admin/backup/clean', verifyToken, (req, res) => {
  if (!req.user.roles.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { daysOld = 30 } = req.body;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  try {
    const backupFolders = fs.readdirSync(BACKUP_DIR)
      .filter(folder => folder.startsWith('backup-'))
      .map(folder => ({
        name: folder,
        path: path.join(BACKUP_DIR, folder),
        date: new Date(folder.replace('backup-', '').replace(/-/g, ':').replace('T', ' ').replace('Z', ''))
      }))
      .filter(backup => backup.date < cutoffDate);

    let deletedCount = 0;
    backupFolders.forEach(backup => {
      try {
        fs.rmSync(backup.path, { recursive: true, force: true });
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting backup ${backup.name}:`, error);
      }
    });

    res.json({ 
      message: `Cleaned ${deletedCount} old backups`,
      deletedCount,
      cutoffDate: cutoffDate.toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cleaning old backups' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Mock server is running',
    dataFiles: {
      users: fs.existsSync(USERS_FILE),
      publications: fs.existsSync(PUBLICATIONS_FILE),
      reviews: fs.existsSync(REVIEWS_FILE),
      notifications: fs.existsSync(NOTIFICATIONS_FILE)
    },
    backupCount: fs.existsSync(BACKUP_DIR) ? 
      fs.readdirSync(BACKUP_DIR).filter(folder => folder.startsWith('backup-')).length : 0
  });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Data persistence enabled with automatic backups');
  console.log('Available endpoints:');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/register');
  console.log('- GET /api/auth/me');
  console.log('- GET /api/publicaciones');
  console.log('- POST /api/publicaciones');
  console.log('- PUT /api/publicaciones/:id');
  console.log('- DELETE /api/publicaciones/:id');
  console.log('- GET /api/reviews/mis-reviews');
  console.log('- POST /api/reviews');
  console.log('- PUT /api/reviews/:id');
  console.log('- GET /api/notificaciones/mis-notificaciones');
  console.log('- PUT /api/notificaciones/:id/leer');
  console.log('- GET /api/dashboard/stats');
  console.log('- GET /api/admin/users');
  console.log('- POST /api/admin/backup');
  console.log('- GET /api/admin/backups');
  console.log('- POST /api/admin/backup/restore/:backupName');
  console.log('- DELETE /api/admin/backup/:backupName');
  console.log('- POST /api/admin/export');
  console.log('- POST /api/admin/import');
  console.log('- GET /api/admin/stats');
  console.log('- POST /api/admin/backup/clean');
  console.log('\nTest credentials:');
  console.log('- autor / password');
  console.log('- revisor / password');
  console.log('- editor / password');
  console.log('- admin / password');
  console.log('- lector / password');
});
