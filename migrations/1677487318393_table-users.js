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
        mentor VARCHAR(20) NOT NULL,
        month VARCHAR(9) NOT NULL,
        passport VARCHAR(9) NOT NULL,
        phoneNumber VARCHAR(9) NOT NULL,
        paymentStatus VARCHAR(15) DEFAULT 'not paid',
        paymentCashUrl VARCHAR(150)
    );
    `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE users;
    `);
};
