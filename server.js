const app = require('./app');
const pool = require('./pool');

const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const PORT = process.env.PORT || 8000;
const host = process.env.DB_HOST;
const port = process.env.PGPORT;

pool
  .connect({
    host,
    port,
    user,
    database,
    password,
    ssl: {
      rejectUnauthorized: false,
    },
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
