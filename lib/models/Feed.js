const pool = require('../utils/pool');

module.exports = class Action {
    id;
    userId;
    actionType;
    book;

    constructor(row) {
        this.id = row.id;
        this.userId = row.user_id;
        this.actionType = row.action_type;
        this.book = row.book;
    }

    static async insert(action) {
        const { rows } = await pool.query(`
      INSERT INTO actions (
          user_id,
          action_type,
          book)
      VALUES ($1, $2, $3)
      RETURNING *    
      `,
            [action.userId, action.actionType, action.book]
        );

        return new Action(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query(
            `SELECT * FROM actions`
        );
        return rows.map(row => new Action(row));
    }

    static async getUserActions(userId) {
        const { rows } = await pool.query(
            `SELECT * FROM actions WHERE user_id=$1`,
            [userId]
        );

        return rows.map(book => new Action(action));
    }
};