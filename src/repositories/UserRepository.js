import DB from "../core/Database";

export default class UserRepository {
  static async create(data) {
    const result = await DB.pg.users.insert(data);
    return result;
  }

  static async find(criteria) {
    const result = await DB.pg.users.find(criteria);
    return result;
  }

  static async findById(id) {
    const result = await DB.pg.users.findOne(Number(id));
    return result;
  }

  static async update(criteria, input) {
    const result = await DB.pg.users.update(criteria, input);
    return result;
  }

  static async getUserProfileData(userId) {
    const result = await DB.pg.users.findOne(
      { id: Number(userId) },
      { fields: ["id", "username"] }
    );
    return result;
  }

  static async getUserById(id) {
    const result = await DB.pg.query(
      `SELECT users.username, count(likes.*) as "countLikes" FROM users 
      LEFT JOIN likes ON users.id = likes.user_id
      WHERE users.id = $1
      GROUP BY users.username`,
      [id],
      { single: true }
    );
    return result;
  }

  static async getMostLiked({ limit, offset }) {
    const { count: pageCount } = await DB.pg.query(
      `SELECT count(*) FROM users`,
      false,
      {
        single: true
      }
    );
    const users = await DB.pg.query(
      `SELECT users.id, users.username, count(likes.*) as "countLikes" FROM users
      LEFT JOIN likes ON users.id = likes.user_id
      GROUP BY users.username, users.id
      ORDER BY "countLikes" DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset - 1]
    );
    return { pageCount: parseInt(pageCount, 10), data: users };
  }
}
