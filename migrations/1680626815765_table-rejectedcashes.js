/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE rejectedCashes (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paymentCashUrl VARCHAR(150),
        userId BIGINT REFERENCES users(id)
    )
    `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE rejectedCashes
    `);
};
