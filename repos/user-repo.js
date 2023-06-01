const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class UserRepo {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM users WHERE role = $1;', ['user']);
    return toCamelCase(rows);
  }
  static async findAllUniqueUsers() {
    const { rows } = await pool.query('SELECT * FROM users  WHERE history = $1 AND role = $2  ORDER BY paymentStatus = $3 DESC;', [
      'false',
      'user',
      'not paid',
    ]);
    return toCamelCase(rows);
  }
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM  users WHERE id = $1;', [id]);
    return toCamelCase(rows)[0];
  }
  static async insert(firstname, lastname, course, mentor, date, login, password, phoneNumber, role) {
    await pool.query(
      'INSERT INTO users(firstname, lastname, course, mentor, date, login, password, phoneNumber, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);',
      [firstname, lastname, course, mentor, date, login, password, phoneNumber, role],
    );
  }
  static async update(id, firstname, lastname, course, mentor, login, hashedPassword, phoneNumber) {
    await pool.query(
      'UPDATE users SET firstname = $1, lastname = $2, course = $3, mentor = $4, login = $5, password = $6, phoneNumber = $7 WHERE id = $8;',
      [firstname, lastname, course, mentor, login, hashedPassword, phoneNumber, id],
    );
  }
  static async deleteById(id) {
    await pool.query('DELETE FROM users WHERE id = $1;', [id]);
  }

  static async isUserExists(login) {
    const { rows } = await pool.query('SELECT * FROM users WHERE login = $1;', [login]);
    return toCamelCase(rows)[0];
  }

  static async changePaymentStatusToProgress(userId) {
    const { rows } = await pool.query(`UPDATE users SET paymentStatus = 'in progress' WHERE id = $1 RETURNING *;`, [userId]);
    return toCamelCase(rows)[0];
  }
  static async changePaymentStatusToPaid(userId) {
    await pool.query(`UPDATE users SET paymentStatus = 'paid' WHERE id = $1;`, [userId]);
  }
  static async paidByCash(userId) {
    await pool.query(`UPDATE users SET paymentByCash = true WHERE id = $1;`, [userId]);
  }
  static async changePaymentStatusToRejected(userId) {
    const { rows } = await pool.query(`UPDATE users SET paymentStatus = 'rejected' WHERE id = $1 RETURNING *;`, [userId]);
    return toCamelCase(rows)[0];
  }

  static async uploadCash(pdf, userId) {
    await pool.query(`UPDATE users SET paymentCashUrl = $1 WHERE id = $2;`, [pdf, userId]);
  }
  static async deleteCash(userId) {
    await pool.query(`UPDATE users SET paymentCashUrl = $1 WHERE id = $2 RETURNING *;`, [null, userId]);
  }
  static async findPartial(query) {
    const { rows } = await pool.query('SELECT * FROM users WHERE firstname ILIKE $1 OR lastname ILIKE $1 AND role = $2;', [
      `%${query}%`,
      'user',
    ]);
    return toCamelCase(rows);
  }

  static async insertUsersByHistory(
    firstname,
    lastname,
    course,
    mentor,
    date,
    login,
    password,
    phoneNumber,
    paymentStatus,
    paymentCashUrl,
    paymentByCash,
    role,
    history,
  ) {
    await pool.query(
      'INSERT INTO users(firstname, lastname, course, mentor, date, login, password, phoneNumber, paymentStatus, paymentcashurl, paymentbycash, role, history) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [
        firstname,
        lastname,
        course,
        mentor,
        date,
        login,
        password,
        phoneNumber,
        paymentStatus,
        paymentCashUrl,
        paymentByCash,
        role,
        history,
      ],
    );
  }

  static async passUserToTheNextMonth() {
    await pool.query(
      `UPDATE users SET paymentstatus = 'not paid', date = date_trunc('month', date) + INTERVAL '1 month' WHERE history = $1;`,
      ['false'],
    );
  }
}

module.exports = UserRepo;
