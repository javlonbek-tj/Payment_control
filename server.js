const app = require('./app');
const pool = require('./pool');
const http = require('http');
const logger = require('./repos/utils/logger');

const database = process.env.PGDATABASE;
const password = process.env.PGPASSWORD;
const user = process.env.PG_USER;
const PORT = process.env.PORT || 8000;
const host = process.env.PGHOST;
const port = process.env.PGPORT;

process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

const server = http.createServer(app);

async function startServer() {
  try {
    await pool.connect({
      host,
      port,
      user,
      database,
      password,
    });
    console.log('Connected to db successfully');
    server.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  } catch (err) {
    logger.error('Error connecting to the database:', err);
    process.exit(1);
  }
}

startServer();

process.on('unhandledRejection', err => {
  logger.error('Unhandled rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});
