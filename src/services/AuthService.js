import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { struct } from "superstruct";
import config from "../config";
import { UserRepository } from "../repositories";
import ApiError from "../core/ApiError";
import addTimestamps from "../utils/addTimestamps";

function createJwtToken(userId) {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
}

export default class AuthService {
  static async signup(req) {
    const input = req.body;

    const validator = struct({
      username: "string",
      password: "string"
    });
    validator(input);

    try {
      input.password = bcrypt.hashSync(input.password, 8);
      addTimestamps({ input });
      const result = await UserRepository.create(input);
      return result;
    } catch (error) {
      const { code } = error;
      if (code === "23505") {
        throw new ApiError("Username already taken.", 400, 1001);
      }
      throw error;
    }
  }

  static async login(req) {
    const input = req.body;

    const validator = struct({
      username: "string",
      password: "string"
    });
    validator(input);

    const result = await UserRepository.find({ username: input.username });
    if (result.length > 0) {
      const user = result[0];

      const checkPassword = await bcrypt.compare(input.password, user.password);
      if (checkPassword === false) {
        throw new ApiError("Incorrect password", 401, 1001);
      }

      const token = createJwtToken(user.id);
      return { auth: true, token };
    }
    throw new ApiError("No user with these credentials.", 401, 1000);
  }
}
