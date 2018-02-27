import { UserRepository } from "../repositories";
import ApiError from "../core/ApiError";

export default class UserService {
  static async getUserById(req) {
    const user = await UserRepository.getUserById(req.params.id);
    if (user) return user;
    throw new ApiError("No user found.", 404, 3000);
  }

  static async getMostLiked(req) {
    const { limit, page: offset } = req.query;
    const result = await UserRepository.getMostLiked({ limit, offset });
    return result;
  }
}
