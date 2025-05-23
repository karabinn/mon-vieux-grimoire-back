const http = require('http');
const cors = require('cors');
const app = require('./app');

// Middleware CORS
app.use(cors());

// Fonction pour normaliser le port
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
};

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

// Route principale
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Gestion des erreurs
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur
const server = http.createServer(app);

// Événements serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

// Démarrage du serveur
server.listen(port);