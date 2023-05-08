const pool = require('../pool');

class MentorRepo {
  static async insert(name) {
    await pool.query('INSERT INTO mentors(name) VALUES ($1); ', [name]);
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM mentors');
    return rows;
  }

  static async findByName(name) {
    const { rows } = await pool.query('SELECT * FROM mentors WHERE name = $1;', [name]);
    return rows;
  }
}

module.exports = MentorRepo;
