const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class MessageRepo {
  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN messages ON users.id = messages.userId WHERE read = false;',
    );
    return toCamelCase(rows);
  }
  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM messages JOIN users ON users.id = messages.userId WHERE userId = $1',
      [id],
    );
    return toCamelCase(rows)[0];
  }
  static async insert(text, userId) {
    const { rows } = await pool.query(
      'INSERT INTO messages(message, userId) VALUES ($1, $2) RETURNING *; ',
      [text, userId],
    );
    return toCamelCase(rows)[0];
  }
  static async deleteById(id) {
    await pool.query('DELETE FROM messages WHERE id = $1;', [id]);
  }
}

module.exports = MessageRepo;
