/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL
)
`);
};

exports.down = pgm => {
  pgm.sql(`
DROP TABLE courses
`);
};
