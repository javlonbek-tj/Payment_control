const app = require('./app');
const pool = require('./pool');

const database = process.env.PG_DATABASE;
const password = process.env.PG_PASSWORD;
const user = process.env.PG_USER;
const PORT = process.env.PORT || 8000;

pool
  .connect({
    host: 'manny.db.elephantsql.com',
    port: 5432,
    user,
    database,
    password,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
