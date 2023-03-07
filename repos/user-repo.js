const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class UserRepo {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM users WHERE role = $1;', ['user']);
    return toCamelCase(rows);
  }
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
    return toCamelCase(rows)[0];
  }
  static async insert(firstname, lastname, course, mentor, date, passport, phoneNumber, role) {
    const { rows } = await pool.query(
      'INSERT INTO users(firstname, lastname, course, mentor, date, passport, phoneNumber, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *; ',
      [firstname, lastname, course, mentor, date, passport, phoneNumber, role],
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
  static async changePaymentStatusToRejected(userId) {
    const { rows } = await pool.query(
      `UPDATE users SET paymentstatus = 'rejected' WHERE id = $1 RETURNING *;`,
      [userId],
    );
    return toCamelCase(rows)[0];
  }

  static async uploadCash(pdf, userId) {
    await pool.query(`UPDATE users SET paymentCashUrl = $1 WHERE id = $2;`, [pdf, userId]);
  }
  static async deleteCash(userId) {
    await pool.query(`UPDATE users SET paymentCashUrl = $1 WHERE id = $2 RETURNING *;`, [
      null,
      userId,
    ]);
  }
  static async findPartial(query) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE firstname ILIKE '%${query}%' AND role = $1;`,
      ['user'],
    );
    return toCamelCase(rows);
  }
  static async findByCategories(course, mentor, paymentstatus, dateFrom, dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1, mentor = $2, paymentstatus = $3, date BETWEEN $4 AND $5;',
      [course, mentor, paymentstatus, dateFrom, dateTo],
    );
    return toCamelCase(rows);
  }
}

module.exports = UserRepo;
