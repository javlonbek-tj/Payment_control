const app = require('./app');
const pool = require('./pool');

const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const PORT = process.env.PORT || 8000;
const host = process.env.DB_HOST;

pool
  .connect({
    host,
    port: 5432,
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
