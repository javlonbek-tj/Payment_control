/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
      CREATE TABLE usersHistory (
          id SERIAL PRIMARY KEY,
          userId BIGINT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          firstname VARCHAR(40) NOT NULL,
          lastname VARCHAR(20) NOT NULL,
          course VARCHAR(20) NOT NULL,
          mentor VARCHAR(40) NOT NULL,
          date TIMESTAMP NOT NULL,
          phoneNumber VARCHAR(20) NOT NULL,
          paymentStatus VARCHAR(15) NOT NULL,
          paymentCashUrl VARCHAR(150),
          paymentByCash BOOLEAN DEFAULT false,
          role VARCHAR(15) NOT NULL DEFAULT 'user'
      );
      `);
};

exports.down = pgm => {
  pgm.sql(`
      DROP TABLE usersHistory;
      `);
};
