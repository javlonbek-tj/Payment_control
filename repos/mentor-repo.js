const pool = require('../pool');

class MentorRepo {
  static async insert(name) {
    await pool.query('INSERT INTO mentors(name) VALUES ($1); ', [name]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM mentors');
    return rows;
  }
}

module.exports = MentorRepo;
