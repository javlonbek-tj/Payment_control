const pool = require('../../pool');
const toCamelCase = require('./to-camel-case');
const findByCategories = async (course, mentor, paymentstatus, dateFrom, dateTo) => {
  //If exists all of them
  if (course && mentor && paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND paymentstatus = $3 AND date BETWEEN $4 AND $5;',
      [course, mentor, paymentstatus, dateFrom, dateTo],
    );
    return toCamelCase(rows);
  }
  //If exists only course
  if (course && !mentor && !paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE course = $1;', [course]);
    return toCamelCase(rows);
  }
  // If exists course and mentor
  if (course && mentor && !paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE course = $1 AND mentor = $2;', [
      course,
      mentor,
    ]);
    return toCamelCase(rows);
  }
  // If exists course, mentor and paymentstatus
  if (course && mentor && paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND paymentstatus = $3;',
      [course, mentor, paymentstatus],
    );
    return toCamelCase(rows);
  }
  // If exists course, mentor and dateFrom
  if (course && mentor && !paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND date > $3;',
      [course, mentor, dateFrom],
    );
    return toCamelCase(rows);
  }
  // If exists course, mentor, dateFrom and dateTo
  if (course && mentor && !paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND date BETWEEN $3 AND $4;',
      [course, mentor, dateFrom, dateTo],
    );
    return toCamelCase(rows);
  }
  // If exists course and paymentstatus
  if (course && !mentor && paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2;',
      [course, paymentstatus],
    );
    return toCamelCase(rows);
  }
  // If exists course, paymentstatus and dateDrom
  if (course && !mentor && paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date > $3;',
      [course, paymentstatus, dateFrom],
    );
    return toCamelCase(rows);
  }
  // If exists course, paymentstatus, dateDrom and dateTo
  if (course && !mentor && paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date BETWEEN $3 AND $4;',
      [course, paymentstatus, dateFrom, dateTo],
    );
    return toCamelCase(rows);
  }
  // If exists course, paymentstatus and dateTo
  if (course && !mentor && paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date < $3;',
      [course, paymentstatus, dateTo],
    );
    return toCamelCase(rows);
  }
  // If exists course and dateFrom
  if (course && !mentor && !paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE course = $1 AND date > $2;', [
      course,
      dateFrom,
    ]);
    return toCamelCase(rows);
  }
  // If exists course, dateFrom and dateTo
  if (course && !mentor && !paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date BETWEEN $2 AND $3;',
      [course, dateFrom, dateTo],
    );
    return toCamelCase(rows);
  }
  // If exists course and dateTo
  if (course && !mentor && !paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE course = $1 AND date < $2;', [
      course,
      dateTo,
    ]);
    return toCamelCase(rows);
  }
  // If exists only mentor
  if (!course && mentor && !paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE mentor = $1;', [mentor]);
    return toCamelCase(rows);
  }
  // If exists mentor and paymentstatus
  if (!course && mentor && paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2;',
      [mentor, paymentstatus],
    );
    return toCamelCase(rows);
  }
  // If exists mentor, paymentstatus and dateFrom
  if (!course && mentor && paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date > $3;',
      [mentor, paymentstatus, dateFrom],
    );
    return toCamelCase(rows);
  }
  // If exists mentor, paymentstatus, dateFrom and dateTo
  if (!course && mentor && paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date BETWEEN $3 AND $4;',
      [mentor, paymentstatus, dateFrom, dateTo],
    );
    return toCamelCase(rows);
  }
  // If exists mentor, paymentstatus and dateTo
  if (!course && mentor && paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date < $3;',
      [mentor, paymentstatus, dateTo],
    );
    return toCamelCase(rows);
  }
  // If exists mentor and dateTo
  if (!course && mentor && !paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE mentor = $1 AND date < $2;', [
      mentor,
      dateTo,
    ]);
    return toCamelCase(rows);
  }
  // If exists only paymentstatus
  if (!course && !mentor && paymentstatus && !dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE paymentstatus = $1;', [
      paymentstatus,
    ]);
    return toCamelCase(rows);
  }
  // If exists paymentstatus, dateFrom and dateTo
  if (!course && !mentor && paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date BETWEEN $2 AND $3;',
      [paymentstatus, dateFrom, dateTo],
    );
    return toCamelCase(rows);
  }
  // If exists paymentstatus and dateFrom
  if (!course && !mentor && paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date > $2;',
      [paymentstatus, dateFrom],
    );
    return toCamelCase(rows);
  }
  // If exists paymentstatus and dateTo
  if (!course && !mentor && paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date < $2;',
      [paymentstatus, dateTo],
    );
    return toCamelCase(rows);
  }
  // If exists only dateFrom
  if (!course && !mentor && !paymentstatus && dateFrom && !dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE date >= $1;', [dateFrom]);
    return toCamelCase(rows);
  }
  // If exists dateFrom and dateTo
  if (!course && !mentor && !paymentstatus && dateFrom && dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE date BETWEEN $1 AND $2;', [
      dateFrom,
      dateTo,
    ]);
    return toCamelCase(rows);
  }
  // If exists only dateTo
  if (!course && !mentor && !paymentstatus && !dateFrom && dateTo) {
    const { rows } = await pool.query('SELECT * FROM users WHERE date <= $1;', [dateTo]);
    return toCamelCase(rows);
  }
};

module.exports = findByCategories;
