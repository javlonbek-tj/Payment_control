const pool = require('../../pool');
const toCamelCase = require('./to-camel-case');
const findByCategories = async (course, mentor, paymentstatus, dateFrom, dateTo) => {
  //If exists all of them
  if (course && mentor && paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND paymentstatus = $3 AND date BETWEEN $4 AND $5 AND role = $6;',
      [course, mentor, paymentstatus, dateFrom, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  //If exists only course
  if (course && !mentor && !paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE course = $1 AND role = $2;', [
      course,
      'user',
    ]);
    return toCamelCase(rows);
  }
  // If exists course and mentor
  if (course && mentor && !paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND role = $3;',
      [course, mentor, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course, mentor and paymentstatus
  if (course && mentor && paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND paymentstatus = $3 AND role = $4;',
      [course, mentor, paymentstatus, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course, mentor and dateFrom
  if (course && mentor && !paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND date > $3 AND role = $4;',
      [course, mentor, dateFrom, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course, mentor, dateFrom and dateTo
  if (course && mentor && !paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND date BETWEEN $3 AND $4 AND role = $5;',
      [course, mentor, dateFrom, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course and paymentstatus
  if (course && !mentor && paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND role = $3;',
      [course, paymentstatus, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course, paymentstatus and dateDrom
  if (course && !mentor && paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date > $3 AND role = $4;',
      [course, paymentstatus, dateFrom, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course, paymentstatus, dateDrom and dateTo
  if (course && !mentor && paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date BETWEEN $3 AND $4 AND role = $5;',
      [course, paymentstatus, dateFrom, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course, paymentstatus and dateTo
  if (course && !mentor && paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date < $3 AND role = $4;',
      [course, paymentstatus, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course and dateFrom
  if (course && !mentor && !paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date > $2 AND role = $3;',
      [course, dateFrom, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course, dateFrom and dateTo
  if (course && !mentor && !paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date BETWEEN $2 AND $3  AND role = $4;',
      [course, dateFrom, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists course and dateTo
  if (course && !mentor && !paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date < $2 AND role = $3;',
      [course, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists only mentor
  if (!course && mentor && !paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE mentor = $1 AND role = $2;', [
      mentor,
      'user',
    ]);
    return toCamelCase(rows);
  }
  // If exists mentor and paymentstatus
  if (!course && mentor && paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND role = $3;',
      [mentor, paymentstatus, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists mentor, paymentstatus and dateFrom
  if (!course && mentor && paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date > $3 AND role = $4;',
      [mentor, paymentstatus, dateFrom, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists mentor, paymentstatus, dateFrom and dateTo
  if (!course && mentor && paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date BETWEEN $3 AND $4 AND role = $5;',
      [mentor, paymentstatus, dateFrom, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists mentor, paymentstatus and dateTo
  if (!course && mentor && paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date < $3 AND role = $4;',
      [mentor, paymentstatus, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists mentor and dateTo
  if (!course && mentor && !paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND date < $2 AND role = $3;',
      [mentor, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists only paymentstatus
  if (!course && !mentor && paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND role = $2;',
      [paymentstatus, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists paymentstatus, dateFrom and dateTo
  if (!course && !mentor && paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date BETWEEN $2 AND $3 AND role = $4;',
      [paymentstatus, dateFrom, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists paymentstatus and dateFrom
  if (!course && !mentor && paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date > $2 AND role = $3;',
      [paymentstatus, dateFrom, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists paymentstatus and dateTo
  if (!course && !mentor && paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date < $2 AND role = $3;',
      [paymentstatus, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists only dateFrom
  if (!course && !mentor && !paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE date >= $1 AND role = $2;', [
      dateFrom,
      'user',
    ]);
    return toCamelCase(rows);
  }
  // If exists dateFrom and dateTo
  if (!course && !mentor && !paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE date BETWEEN $1 AND $2 AND role = $3;',
      [dateFrom, dateTo, 'user'],
    );
    return toCamelCase(rows);
  }
  // If exists only dateTo
  if (!course && !mentor && !paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE date <= $1 AND role = $2;', [
      dateTo,
      'user',
    ]);
    return toCamelCase(rows);
  }
};

module.exports = findByCategories;
