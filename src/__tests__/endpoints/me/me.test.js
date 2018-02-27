/* eslint no-undef: 0 */
import request from "supertest";
import bcrypt from "bcryptjs";
import App from "../../../core/App";
import DB from "../../../core/Database";
import randomString from "../../../utils/randomString";

// const password = bcrypt.hashSync("Pass", 8);
const credentials = { username: randomString(), password: "Pass" };
let appInstance;
let jwtToken;
let userId;

beforeAll(async () => {
  appInstance = await new App().start();

  const user = await DB.pg.users.insert({
    username: credentials.username,
    password: bcrypt.hashSync("Pass", 8)
  });
  userId = user.id;

  const loginResponse = await request(appInstance)
    .post("/login")
    .send(credentials);

  jwtToken = loginResponse.body.token;
});

afterAll(async () => {
  await DB.pg.users.destroy({ id: userId });
});

describe("Test /me path", () => {
  test("It should response the GET method", async () => {
    const response = await request(appInstance)
      .get("/me")
      .set("Authorization", `JWT ${jwtToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String)
    });
  });
});

describe("Test /me/update-password path", () => {
  test("It should response the PUT method", async () => {
    const response = await request(appInstance)
      .put("/me/update-password")
      .set("Authorization", `JWT ${jwtToken}`)
      .send({ password: "newpassword" });
    expect(response.statusCode).toBe(204);
  });
});
