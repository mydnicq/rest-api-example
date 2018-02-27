/* eslint no-undef: 0 */
import request from "supertest";
import App from "../../../core/App";
import DB from "../../../core/Database";
import randomString from "../../../utils/randomString";

const credentials = { username: randomString(), password: "Pass" };
let appInstance;

beforeAll(async () => {
  appInstance = await new App().start();
});

afterAll(async () => {
  await DB.pg.users.destroy({ username: credentials.username });
});

describe("Test /signup path", () => {
  test("It should create a new user", async () => {
    const response = await request(appInstance)
      .post("/signup")
      .send({ username: credentials.username, password: credentials.password });
    expect(response.statusCode).toBe(201);
  });
});

describe("Test /login path", () => {
  test("It should get a JWT token after successful login.", async () => {
    const response = await request(appInstance)
      .post("/login")
      .send({ username: credentials.username, password: credentials.password });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      auth: true,
      token: expect.any(String)
    });
  });
});

describe("Test /most-liked path", () => {
  test("It should get a paginated list of users", async () => {
    const response = await request(appInstance).get("/most-liked");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      pageCount: expect.any(Number),
      data: expect.any(Array)
    });
  });
});
