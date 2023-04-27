/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        firstname VARCHAR(40) NOT NULL,
        lastname VARCHAR(20) NOT NULL,
        UNIQUE(firstname, lastname),
        course VARCHAR(20) NOT NULL,
        mentor VARCHAR(40) NOT NULL,
        date TIMESTAMP NOT NULL,
        login VARCHAR(20) NOT NULL,
        password VARCHAR(300) NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL,
        paymentStatus VARCHAR(15) DEFAULT 'not paid',
        paymentCashUrl VARCHAR(150),
        paymentByCash BOOLEAN DEFAULT false,
        role VARCHAR(15) NOT NULL DEFAULT 'user'
    );
    `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE users;
    `);
};
