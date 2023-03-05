/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        message VARCHAR(200) NOT NULL,
        userId BIGINT REFERENCES users(id),
        read BOOLEAN DEFAULT false
    )
    `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE messages
    `);
};
