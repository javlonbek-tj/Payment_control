const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class MessageRepo {
  static async findAllWithoutMe(id) {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN messages ON users.id = messages.userId WHERE userId != $1 ORDER BY messages.created_at DESC;',
      [id],
    );
    return toCamelCase(rows);
  }

  static async findMyMessages(id) {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN messages ON users.id = messages.userId WHERE userId = $1 ORDER BY messages.created_at DESC;',
      [id],
    );
    return toCamelCase(rows);
  }
  static async findUnreadMessages(id) {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN messages ON users.id = messages.userId WHERE userId != $1 AND read = false',
      [id],
    );
    return toCamelCase(rows);
  }
  static async insert(text, userId) {
    const { rows } = await pool.query('INSERT INTO messages(message, userId) VALUES ($1, $2) RETURNING *;', [text, userId]);
    return toCamelCase(rows)[0];
  }
  static async deleteById(id) {
    await pool.query('DELETE FROM messages WHERE id = $1;', [id]);
  }
  static async makeMessagesRead(id) {
    await pool.query('UPDATE messages SET read = true WHERE userId != $1;', [id]);
  }
}

module.exports = MessageRepo;
