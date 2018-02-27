import DB from "../core/Database";

export default class LikeRepository {
  static async create(data) {
    const result = await DB.pg.likes.insert(data);
    return result;
  }
  static async find(data) {
    const result = await DB.pg.likes.find(data);
    return result;
  }
  static async destroy(data) {
    const result = await DB.pg.likes.destroy(data);
    return result;
  }
  static async count(criteria) {
    const result = await DB.pg.likes.count(criteria);
    return result;
  }
}
