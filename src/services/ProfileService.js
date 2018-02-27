import { struct } from "superstruct";
import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories";
import addTimestamps from "../utils/addTimestamps";

export default class ProfileService {
  static async getUserProfileData(req) {
    const result = await UserRepository.getUserProfileData(req.user.id);
    return result;
  }
  static async updatePassword(req) {
    const input = req.body;
    const criteria = { id: req.user.id };

    const validator = struct({
      password: "string"
    });
    validator(input);

    input.password = bcrypt.hashSync(input.password, 8);
    addTimestamps({ input, type: "updated" });
    const result = await UserRepository.update(criteria, input);
    return result;
  }
}
