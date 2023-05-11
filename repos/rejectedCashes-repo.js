const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class RejectedCashesRepo {
  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM rejectedCashes JOIN users ON users.id = rejectedCashes.userId ORDER BY rejectedCashes.created_at DESC;',
    );
    return toCamelCase(rows);
  }
  static async insert(paymentCashUrl, userId) {
    await pool.query('INSERT INTO rejectedCashes(paymentCashUrl, userId) VALUES ($1, $2) RETURNING *; ', [paymentCashUrl, userId]);
  }
  static async findById(userId) {
    const { rows } = await pool.query('SELECT * FROM rejectedCashes WHERE userId = $1;', [userId]);
    return toCamelCase(rows);
  }
}

module.exports = RejectedCashesRepo;
