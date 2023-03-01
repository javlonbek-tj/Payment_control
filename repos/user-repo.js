const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class UserRepo {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM users;');
    return toCamelCase(rows);
  }
  static async findByCourse(course) {
    const { rows } = await pool.query('SELECT * FROM users WHERE course = $1;', [course]);
    return toCamelCase(rows);
  }
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return toCamelCase(rows)[0];
  }
  static async insert(firstname, lastname, course, mentor, month, passport, phoneNumber) {
    const { rows } = await pool.query(
      'INSERT INTO users(firstname, lastname, course, mentor, month, passport, phoneNumber) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *; ',
      [firstname, lastname, course, mentor, month, passport, phoneNumber],
    );
    await pool.query(
      'INSERT INTO admins(firstname, lastname, passport, phoneNumber) VALUES ($1, $2, $3, $4);',
      [firstname, lastname, passport, phoneNumber],
    );
    return toCamelCase(rows)[0];
  }
  static async update(id, firstname, lastname, course, mentor, passport, phoneNumber) {
    const { rows } = await pool.query(
      'UPDATE users SET firstname = $1, lastname = $2, course = $3, mentor = $4, passport = $5, phoneNumber = $6 WHERE id = $7 RETURNING *;',
      [firstname, lastname, course, mentor, passport, phoneNumber, id],
    );
    return toCamelCase(rows);
  }
  static async deleteById(id) {
    await pool.query('DELETE FROM users WHERE id = $1;', [id]);
  }

  static async isUserExists(passport, phoneNumber) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE passport = $1 AND phoneNumber = $2;',
      [passport, phoneNumber],
    );
    return toCamelCase(rows)[0];
  }

  static async changePaymentStatusToProgress(userId) {
    const { rows } = await pool.query(
      `UPDATE users SET paymentstatus = 'in progress' WHERE id = $1 RETURNING *;`,
      [userId],
    );
    return toCamelCase(rows)[0];
  }
  static async changePaymentStatusToPaid(userId) {
    const { rows } = await pool.query(
      `UPDATE users SET paymentstatus = 'paid' WHERE id = $1 RETURNING *;`,
      [userId],
    );
    return toCamelCase(rows)[0];
  }

  static async uploadCash(pdf, userId) {
    await pool.query(`UPDATE users SET paymentCashUrl = $1 WHERE id = $2;`, [pdf, userId]);
  }
}

module.exports = UserRepo;
