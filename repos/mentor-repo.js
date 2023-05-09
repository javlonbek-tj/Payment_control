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

  static async deleteMentor(id) {
    await pool.query('DELETE FROM mentors WHERE id=$1', [id]);
  }
}

module.exports = MentorRepo;
