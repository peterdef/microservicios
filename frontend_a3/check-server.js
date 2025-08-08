const http = require('http');

function checkServer() {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/publicaciones',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Servidor mock está funcionando en http://localhost:8080`);
    console.log(`📊 Endpoint /api/publicaciones responde con código: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`📝 Publicaciones disponibles: ${response.totalElements || 0}`);
        console.log(`📄 Páginas totales: ${response.totalPages || 0}`);
      } catch (e) {
        console.log('⚠️  Respuesta no es JSON válido');
      }
    });
  });

  req.on('error', (e) => {
    console.log(`❌ Error conectando al servidor: ${e.message}`);
    console.log('');
    console.log('🔧 Para iniciar el servidor mock:');
    console.log('   1. Abra una nueva terminal');
    console.log('   2. Navegue al directorio del proyecto');
    console.log('   3. Ejecute: node mock-server.js');
    console.log('   4. Espere el mensaje "Mock server running on http://localhost:8080"');
  });

  req.setTimeout(5000, () => {
    console.log('⏰ Timeout: El servidor no respondió en 5 segundos');
    console.log('');
    console.log('🔧 Para iniciar el servidor mock:');
    console.log('   1. Abra una nueva terminal');
    console.log('   2. Navegue al directorio del proyecto');
    console.log('   3. Ejecute: node mock-server.js');
    console.log('   4. Espere el mensaje "Mock server running on http://localhost:8080"');
  });

  req.end();
}

console.log('🔍 Verificando servidor mock...');
checkServer();
