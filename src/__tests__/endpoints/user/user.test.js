/* eslint no-undef: 0 */
import request from "supertest";
import App from "../../../core/App";
import DB from "../../../core/Database";
import randomString from "../../../utils/randomString";

let appInstance;
let userId;

beforeAll(async () => {
  appInstance = await new App().start();
  const user = await DB.pg.users.insert({
    username: randomString(),
    password: "Pass"
  });
  userId = user.id;
});

afterAll(async () => {
  await DB.pg.users.destroy({ id: userId });
});

describe("Test /user/:id path", () => {
  test("It should get user username and number of likes", async () => {
    const response = await request(appInstance).get(`/user/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      username: expect.any(String),
      countLikes: expect.any(String)
    });
  });
});
