/* eslint no-undef: 0 */
import request from "supertest";
import bcrypt from "bcryptjs";
import App from "../../../core/App";
import DB from "../../../core/Database";
import randomString from "../../../utils/randomString";

let appInstance;
let jwtToken;
let userId;
let likedBy;

const usersData = [
  { username: randomString(), password: "Pass" },
  { username: randomString(), password: "Pass" }
];

beforeAll(async () => {
  appInstance = await new App().start();

  const usersDataHashed = [
    { username: usersData[0].username, password: bcrypt.hashSync("Pass", 8) },
    { username: usersData[1].username, password: bcrypt.hashSync("Pass", 8) }
  ];

  usersDataHashed.forEach(async (input, index) => {
    const result = await DB.pg.users.insert(input);
    if (index === 0) likedBy = result.id;
    if (index === 1) userId = result.id;
  });

  const loginResponse = await request(appInstance)
    .post("/login")
    .send(usersData[0]);

  jwtToken = loginResponse.body.token;
});

afterAll(async () => {
  await DB.pg.likes.destroy({
    user_id: userId,
    liked_by: likedBy
  });
  usersData.forEach(async data => {
    await DB.pg.users.destroy({ username: data.username });
  });
});

describe("Test /user/:id/like path", () => {
  test("It should like other user", async () => {
    const response = await request(appInstance)
      .post(`/user/${userId}/like`)
      .set("Authorization", `JWT ${jwtToken}`);
    expect(response.statusCode).toBe(204);
  });
  test("It shouldn't like other user (only once is allowed)", async () => {
    const response = await request(appInstance)
      .post(`/user/${userId}/like`)
      .set("Authorization", `JWT ${jwtToken}`);
    expect(response.statusCode).toBe(400);
  });
  test("It shouldn't like a user who doesn't exists.", async () => {
    const response = await request(appInstance)
      .post(`/user/1000000000000/like`)
      .set("Authorization", `JWT ${jwtToken}`);
    expect(response.statusCode).toBe(400);
  });
  test("It shouldn't like itself.", async () => {
    const response = await request(appInstance)
      .post(`/user/${likedBy}/like`)
      .set("Authorization", `JWT ${jwtToken}`);
    expect(response.statusCode).toBe(400);
  });
});

describe("Test /user/:id/unlike path", () => {
  test("It should unlike other user", async () => {
    const response = await request(appInstance)
      .post(`/user/${userId}/unlike`)
      .set("Authorization", `JWT ${jwtToken}`);
    expect(response.statusCode).toBe(204);
  });
  test("It can't unlike other user (like doesn't exists)", async () => {
    const response = await request(appInstance)
      .post(`/user/${userId}/unlike`)
      .set("Authorization", `JWT ${jwtToken}`);
    expect(response.statusCode).toBe(422);
  });
});
