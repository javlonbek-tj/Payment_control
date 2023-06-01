const app = require('./app');
const pool = require('./pool');

const database = process.env.PGDATABASE;
const password = process.env.PGPASSWORD;
const user = process.env.PG_USER;
const PORT = process.env.PORT || 8000;
const host = process.env.PGHOST;
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
