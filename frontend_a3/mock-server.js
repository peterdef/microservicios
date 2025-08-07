const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const users = [
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

const publications = [
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

const reviews = [
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

const notifications = [
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
    id: users.length + 1,
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
    id: publications.length + 1,
    ...req.body,
    autorId: req.user.id,
    autor: `${req.user.nombres} ${req.user.apellidos}`,
    fechaCreacion: new Date().toISOString(),
    estado: 'BORRADOR'
  };

  publications.push(newPublication);
  res.status(201).json(newPublication);
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
  const notification = notifications.find(n => n.id === parseInt(req.params.id));
  if (notification) {
    notification.leida = true;
    notification.estado = 'LEIDA';
  }
  res.json(notification);
});

app.get('/api/notificaciones/unread-count', verifyToken, (req, res) => {
  const unreadCount = notifications.filter(n => 
    n.usuarioId === req.user.id && !n.leida
  ).length;
  
  res.json({ count: unreadCount });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server is running' });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/register');
  console.log('- GET /api/auth/me');
  console.log('- GET /api/publicaciones');
  console.log('- GET /api/publicaciones/mis-publicaciones');
  console.log('- GET /api/reviews/mis-reviews');
  console.log('- GET /api/notificaciones/mis-notificaciones');
  console.log('\nTest credentials:');
  console.log('- autor / password');
  console.log('- revisor / password');
  console.log('- editor / password');
  console.log('- admin / password');
  console.log('- lector / password');
});
