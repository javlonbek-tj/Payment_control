const pool = require('../../pool');
const toCamelCase = require('./to-camel-case');
const findByCategories = async (course, mentor, paymentstatus, dateFrom, dateTo, history, limit, offset) => {
  //If exists all of them
  if (course && mentor && paymentstatus && dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE course = $1 AND mentor = $2 AND paymentstatus = $3 AND date BETWEEN $4 AND $5 AND role = $6 AND history = $7 LIMIT $8 OFFSET $9;`,
      [course, mentor, paymentstatus, dateFrom, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      `SELECT * FROM users WHERE course = $1 AND mentor = $2 AND paymentstatus = $3 AND date BETWEEN $4 AND $5 AND role = $6 AND history = $7;`,
      [course, mentor, paymentstatus, dateFrom, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }

  // If exists only course
  if (course && !mentor && !paymentstatus && !dateFrom && !dateTo && history) {
    const { rows } = await pool.query('SELECT * FROM users WHERE course = $1 AND role = $2 AND history =$3 LIMIT $4 OFFSET $5;', [
      course,
      'user',
      history,
      limit,
      offset,
    ]);
    const { rows: totalUsersRows } = await pool.query('SELECT * FROM users WHERE course = $1 AND role = $2 AND history =$3;', [
      course,
      'user',
      history,
    ]);
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }

  // If exists course and mentor
  if (course && mentor && !paymentstatus && !dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND role = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [course, mentor, 'user', history, limit, history],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND role = $3 AND history = $4;',
      [course, mentor, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }

  // If exists course, mentor and paymentstatus
  if (course && mentor && paymentstatus && !dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND paymentstatus = $3 AND role = $4 AND history = $5 LIMIT $6 OFFSET $7;',
      [course, mentor, paymentstatus, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND paymentstatus = $3 AND role = $4 AND history = $5;',
      [course, mentor, paymentstatus, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }

  // If exists course, mentor and dateFrom
  if (course && mentor && !paymentstatus && dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND date > $3 AND role = $4 AND history = $5 LIMIT $6 OFFSET $7;',
      [course, mentor, dateFrom, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND date > $3 AND role = $4 AND history = $5;',
      [course, mentor, dateFrom, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }

  // If exists course, mentor, dateFrom and dateTo
  if (course && mentor && !paymentstatus && dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND date BETWEEN $3 AND $4 AND role = $5 AND history = $6 LIMIT $7 OFFSET $8;',
      [course, mentor, dateFrom, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND mentor = $2 AND date BETWEEN $3 AND $4 AND role = $5 AND history = $6;',
      [course, mentor, dateFrom, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists course and paymentstatus
  if (course && !mentor && paymentstatus && !dateFrom && !dateTo && history) {
    const { rows } = await pool.query('SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND role = $3 LIMIT $4 OFFSET $5;', [
      course,
      paymentstatus,
      'user',
      limit,
      offset,
    ]);
    const { rows: totalUsersRows } = await pool.query('SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND role = $3;', [
      course,
      paymentstatus,
      'user',
    ]);
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists course, paymentstatus and dateDrom
  if (course && !mentor && paymentstatus && dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date > $3 AND role = $4 AND history = $5 LIMIT $6 OFFSET $7;',
      [course, paymentstatus, dateFrom, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date > $3 AND role = $4 AND history = $5;',
      [course, paymentstatus, dateFrom, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists course, paymentstatus, dateDrom and dateTo
  if (course && !mentor && paymentstatus && dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date BETWEEN $3 AND $4 AND role = $5 AND history = $6 LIMIT $7 OFFSET $8;',
      [course, paymentstatus, dateFrom, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date BETWEEN $3 AND $4 AND role = $5 AND history = $6;',
      [course, paymentstatus, dateFrom, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists course, paymentstatus and dateTo
  if (course && !mentor && paymentstatus && !dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date < $3 AND role = $4 AND history = $5 LIMIT $6 OFFSET $7;',
      [course, paymentstatus, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND paymentstatus = $2 AND date < $3 AND role = $4 AND history = $5;',
      [course, paymentstatus, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists course and dateFrom
  if (course && !mentor && !paymentstatus && dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date > $2 AND role = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [course, dateFrom, 'user', history, limit.offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date > $2 AND role = $3 AND history = $4;',
      [course, dateFrom, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists course, dateFrom and dateTo
  if (course && !mentor && !paymentstatus && dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date BETWEEN $2 AND $3  AND role = $4 AND history = $5 LIMIT $6 OFFSET $7;',
      [course, dateFrom, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date BETWEEN $2 AND $3  AND role = $4 AND history = $5;',
      [course, dateFrom, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists course and dateTo
  if (course && !mentor && !paymentstatus && !dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date < $2 AND role = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [course, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE course = $1 AND date < $2 AND role = $3 AND history = $4;',
      [course, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists only mentor
  if (!course && mentor && !paymentstatus && !dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND role = $2 AND history = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [mentor, 'user', 'false', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND role = $2 AND history = $3 AND history = $4;',
      [mentor, 'user', 'false', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists mentor and paymentstatus
  if (!course && mentor && paymentstatus && !dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND role = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [mentor, paymentstatus, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND role = $3 AND history = $4;',
      [mentor, paymentstatus, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists mentor, paymentstatus and dateFrom
  if (!course && mentor && paymentstatus && dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date > $3 AND role = $4 AND history = $5 LIMIT $6 OFFSET $7;',
      [mentor, paymentstatus, dateFrom, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date > $3 AND role = $4 AND history = $5;',
      [mentor, paymentstatus, dateFrom, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists mentor, paymentstatus, dateFrom and dateTo
  if (!course && mentor && paymentstatus && dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date BETWEEN $3 AND $4 AND role = $5 AND history = $6 LIMIT $7 OFFSET $8;',
      [mentor, paymentstatus, dateFrom, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date BETWEEN $3 AND $4 AND role = $5 AND history = $6;',
      [mentor, paymentstatus, dateFrom, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists mentor, paymentstatus and dateTo
  if (!course && mentor && paymentstatus && !dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date < $3 AND role = $4 AND history = $5 LIMIT $6 OFFSET $7;',
      [mentor, paymentstatus, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND paymentstatus = $2 AND date < $3 AND role = $4 AND history = $5;',
      [mentor, paymentstatus, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists mentor and dateTo
  if (!course && mentor && !paymentstatus && !dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND date < $2 AND role = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [mentor, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE mentor = $1 AND date < $2 AND role = $3 AND history = $4;',
      [mentor, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists only paymentstatus
  if (!course && !mentor && paymentstatus && !dateFrom && !dateTo && history) {
    const { rows } = await pool.query('SELECT * FROM users WHERE paymentstatus = $1 AND role = $2 AND history = $3 LIMIT $4 OFFSET $5;', [
      paymentstatus,
      'user',
      history,
      limit,
      offset,
    ]);
    const { rows: totalUsersRows } = await pool.query('SELECT * FROM users WHERE paymentstatus = $1 AND role = $2 AND history = $3', [
      paymentstatus,
      'user',
      history,
    ]);
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists paymentstatus, dateFrom and dateTo
  if (!course && !mentor && paymentstatus && dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date BETWEEN $2 AND $3 AND role = $4 AND history = $5 LIMIT $6 OFFSET $7;',
      [paymentstatus, dateFrom, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date BETWEEN $2 AND $3 AND role = $4 AND history = $5;',
      [paymentstatus, dateFrom, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists paymentstatus and dateFrom
  if (!course && !mentor && paymentstatus && dateFrom && !dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date > $2 AND role = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [paymentstatus, dateFrom, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date > $2 AND role = $3 AND history = $4;',
      [paymentstatus, dateFrom, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists paymentstatus and dateTo
  if (!course && !mentor && paymentstatus && !dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date < $2 AND role = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [paymentstatus, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE paymentstatus = $1 AND date < $2 AND role = $3 AND history = $4;',
      [paymentstatus, dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists only dateFrom
  if (!course && !mentor && !paymentstatus && dateFrom && !dateTo && history) {
    const { rows } = await pool.query('SELECT * FROM users WHERE date >= $1 AND role = $2 AND history = $3 LIMIT $4 OFFSET $5;', [
      dateFrom,
      'user',
      history,
      limit,
      offset,
    ]);
    const { rows: totalUsersRows } = await pool.query('SELECT * FROM users WHERE date >= $1 AND role = $2 AND history = $3;', [
      dateFrom,
      'user',
      history,
    ]);
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists dateFrom and dateTo
  if (!course && !mentor && !paymentstatus && dateFrom && dateTo && history) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE date BETWEEN $1 AND $2 AND role = $3 AND history = $4 LIMIT $5 OFFSET $6;',
      [dateFrom, dateTo, 'user', history, limit, offset],
    );
    const { rows: totalUsersRows } = await pool.query('SELECT * FROM users WHERE date BETWEEN $1 AND $2 AND role = $3 AND history = $4;', [
      dateFrom,
      dateTo,
      'user',
      history,
    ]);
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists only dateTo
  if (!course && !mentor && !paymentstatus && !dateFrom && dateTo && history) {
    const { rows } = await pool.query('SELECT * FROM users WHERE date <= $1 AND role = $2 AND history = $3 LIMIT $4 OFFSET $5;', [
      dateTo,
      'user',
      history,
      limit,
      offset,
    ]);
    const { rows: totalUsersRows } = await pool.query(
      'SELECT * FROM users WHERE date <= $1 AND role = $2 AND history = $3 LIMIT $4 OFFSET $5;',
      [dateTo, 'user', history],
    );
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
  // If exists only history
  if (!course && !mentor && !paymentstatus && !dateFrom && !dateTo && history) {
    const { rows } = await pool.query('SELECT * FROM users WHERE history = $1 AND role = $2 LIMIT $3 OFFSET $4;', [
      history,
      'user',
      limit,
      offset,
    ]);
    const { rows: totalUsersRows } = await pool.query('SELECT * FROM users WHERE history = $1 AND role = $2;', [history, 'user']);
    const users = toCamelCase(rows);
    const totalUsers = parseInt(totalUsersRows.length);
    return { users, totalUsers };
  }
};

module.exports = findByCategories;
