const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class MessageRepo {
  static async findAdminMessages() {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN messages ON users.id = messages.userId WHERE messages.admin = false ORDER BY messages.created_at DESC;',
    );
    return toCamelCase(rows);
  }

  static async findMessages(id) {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN messages ON users.id = messages.userId WHERE users.id = $1 AND messages.admin = true ORDER BY messages.created_at DESC;',
      [id],
    );
    return toCamelCase(rows);
  }
  static async findUnreadMessages(id) {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN messages ON users.id = messages.userId WHERE userId = $1 AND read = false AND messages.admin = true',
      [id],
    );
    return toCamelCase(rows);
  }

  static async findAdminUnreadMessages() {
    const { rows } = await pool.query(
      'SELECT * FROM users JOIN messages ON users.id = messages.userId WHERE read = false AND messages.admin = false',
    );
    return toCamelCase(rows);
  }
  static async insert(text, admin, userId) {
    const { rows } = await pool.query('INSERT INTO messages(message, admin, userId) VALUES ($1, $2, $3) RETURNING *;', [
      text,
      admin,
      userId,
    ]);
    return toCamelCase(rows)[0];
  }
  static async deleteById(id) {
    await pool.query('DELETE FROM messages WHERE id = $1;', [id]);
  }
  static async makeMessagesRead(id) {
    await pool.query('UPDATE messages SET read = true WHERE userId = $1 AND messages.admin = true;', [id]);
  }

  static async makeAdminMessagesRead() {
    await pool.query('UPDATE messages SET read = true WHERE messages.admin = false;');
  }
}

module.exports = MessageRepo;
