/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        firstname VARCHAR(40) NOT NULL,
        lastname VARCHAR(20) NOT NULL,
        UNIQUE(firstname, lastname),
        passport VARCHAR(9) NOT NULL,
        phoneNumber VARCHAR(9) NOT NULL,
        role VARCHAR(15) NOT NULL DEFAULT 'admin'
    );
    `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE users;
    `);
};
