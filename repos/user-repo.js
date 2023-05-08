const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class UserRepo {
  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN courses ON users.courseId = courses.id JOIN mentors ON users.mentorId = mentors.id WHERE role = $1',
      ['user'],
    );
    return toCamelCase(rows);
  }
  static async findAllUniqueUsers() {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN courses ON users.courseId = courses.id JOIN mentors ON users.mentorId = mentors.id WHERE history = $1 AND role = $2;',
      ['false', 'user'],
    );
    return toCamelCase(rows);
  }
  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM JOIN courses ON users.courseId = courses.id JOIN mentors ON users.mentorId = mentors.id users WHERE id = $1;',
      [id],
    );
    return toCamelCase(rows)[0];
  }
  static async insert(firstname, lastname, courseId, mentorId, date, login, password, phoneNumber, role) {
    const { rows } = await pool.query(
      'INSERT INTO users(firstname, lastname, courseId, mentorId, date, login, password, phoneNumber, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *; ',
      [firstname, lastname, courseId, mentorId, date, login, password, phoneNumber, role],
    );
    return toCamelCase(rows)[0];
  }
  static async update(id, firstname, lastname, courseId, mentorId, login, hashedPassword, phoneNumber) {
    const { rows } = await pool.query(
      'UPDATE users SET firstname = $1, lastname = $2, course = $3, mentor = $4, login = $5, password = $6, phoneNumber = $7 WHERE id = $8 RETURNING *;',
      [firstname, lastname, courseId, mentorId, login, hashedPassword, phoneNumber, id],
    );
    return toCamelCase(rows);
  }
  static async deleteById(id) {
    await pool.query('DELETE FROM users WHERE id = $1;', [id]);
  }

  static async isUserExists(login) {
    const { rows } = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    return toCamelCase(rows)[0];
  }

  static async changePaymentStatusToProgress(userId) {
    await pool.query(`UPDATE users SET paymentstatus = 'in progress' WHERE id = $1;`, [userId]);
  }
  static async changePaymentStatusToPaid(userId) {
    await pool.query(`UPDATE users SET paymentstatus = 'paid' WHERE id = $1;`, [userId]);
  }
  static async paidByCash(userId) {
    await pool.query(`UPDATE users SET paymentByCash = true WHERE id = $1;`, [userId]);
  }
  static async changePaymentStatusToRejected(userId) {
    await pool.query(`UPDATE users SET paymentstatus = 'rejected' WHERE id = $1`, [userId]);
  }

  static async uploadCash(pdf, userId) {
    await pool.query(`UPDATE users SET paymentCashUrl = $1 WHERE id = $2;`, [pdf, userId]);
  }
  static async deleteCash(userId) {
    await pool.query(`UPDATE users SET paymentCashUrl = $1 WHERE id = $2 RETURNING *;`, [null, userId]);
  }
  static async findPartial(query) {
    const { rows } = await pool.query(
      `SELECT * FROM JOIN courses ON users.courseId = courses.id JOIN mentors ON users.mentorId = mentors.id users WHERE firstname ILIKE '%${query}%' AND role = $1;`,
      ['user'],
    );
    return toCamelCase(rows);
  }
  static async findByCategories(courseId, mentorId, paymentstatus, dateFrom, dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN courses ON users.courseId = courses.id JOIN mentors ON users.mentorId = mentors.id WHERE course = $1, mentor = $2, paymentstatus = $3, date BETWEEN $4 AND $5;',
      [courseId, mentorId, paymentstatus, dateFrom, dateTo],
    );
    return toCamelCase(rows);
  }

  static async insertUsersByHistory(
    firstname,
    lastname,
    courseId,
    mentorId,
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
      'INSERT INTO users(firstname, lastname, courseId, mentorId, date, login, password, phoneNumber, paymentStatus, paymentCashUrl, paymentByCash, role, history) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [
        firstname,
        lastname,
        courseId,
        mentorId,
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
