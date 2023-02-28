const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class AdminRepo {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM admins;');
    return toCamelCase(rows);
  }
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM admins WHERE id = $1', [id]);
    return toCamelCase(rows)[0];
  }
  static async insert(firstname, lastname, passport, phoneNumber) {
    await pool.query(
      'INSERT INTO admins(firstname, lastname, passport, phoneNumber) VALUES ($1, $2, $3, $4); ',
      [firstname, lastname, passport, phoneNumber],
    );
  }
  static async update(id, firstname, lastname, passport, phoneNumber) {
    const { rows } = await pool.query(
      'UPDATE admins SET firstname = $1, lastname = $2, passport = $3, phoneNumber = $4 WHERE id = $5 RETURNING *;',
      [firstname, lastname, passport, phoneNumber, id],
    );
    return toCamelCase(rows);
  }
  static async deleteById(id) {
    await pool.query('DELETE FROM admins WHERE id = $1;', [id]);
  }

  static async isAdminExists(passport, phoneNumber) {
    const { rows } = await pool.query(
      'SELECT * FROM admins WHERE passport = $1 AND phoneNumber = $2;',
      [passport, phoneNumber],
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = AdminRepo;
