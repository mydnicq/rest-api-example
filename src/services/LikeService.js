import { struct } from "superstruct";
import { LikeRepository, UserRepository } from "../repositories";
import ApiError from "../core/ApiError";
import addTimestamps from "../utils/addTimestamps";

export default class LikeService {
  static async like(req) {
    const input = {
      user_id: Number(req.params.id),
      liked_by: req.user.id
    };

    const validator = struct({
      user_id: "number",
      liked_by: "number"
    });
    validator(input);

    if (input.user_id === input.liked_by) {
      throw new ApiError("A user cannot like itself.", 400, 2002);
    }

    if (await LikeService.likeExists(input)) {
      throw new ApiError("Like already exists.", 400, 2000);
    }

    if (await UserRepository.findById(input.user_id)) {
      addTimestamps({ input, type: "created" });
      const result = await LikeRepository.create(input);
      return result;
    }

    throw new ApiError("Cannot like a user who doesn't exist.", 400, 2001);
  }

  static async unlike(req) {
    const input = {
      user_id: Number(req.params.id),
      liked_by: req.user.id
    };

    const validator = struct({
      user_id: "number",
      liked_by: "number"
    });
    validator(input);

    if (!await LikeService.likeExists(input)) {
      throw new ApiError("Like doesn't exists.", 422, 2001);
    }

    const result = await LikeRepository.destroy(input);
    return result;
  }

  static async likeExists(data) {
    const result = await LikeRepository.find(data);
    return result.length !== 0;
  }
}
