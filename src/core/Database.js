import massive from "massive";
import config from "../config";

class Database {
  constructor() {
    if (Database.instance) return Database.instance;

    this.pg = "";
    Database.instance = this;
  }

  async init() {
    const {
      pgHost: host,
      pgPort: port,
      pgDBname: database,
      pgUserName: user,
      pgPassword: password
    } = config;
    this.pg = await massive({
      host,
      port,
      database,
      user,
      password
    });
    return this.massive;
  }

  destroy() {
    if (this.pg) this.pg.pgp.end();
  }
}

const instance = new Database();

export default instance;
