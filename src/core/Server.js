import config from "../config";
import App from "./App";

export default class Server {
  constructor() {
    this.server = "";
  }

  async start() {
    if (this.server) return Promise.resolve(Server.createStatusMsg());

    this.server = await new App().start();

    // Set the ip-address of your trusted reverse proxy server such as
    // haproxy or Apache mod proxy or nginx configured as proxy or others.
    // The proxy server should insert the ip address of the remote client
    // through request header 'X-Forwarded-For' as
    // 'X-Forwarded-For: some.client.ip.address'
    this.server.set("trust proxy", "loopback");

    return new Promise(resolve => {
      const { httpPort, httpHost } = config;
      const resolver = () => resolve(Server.createStatusMsg());
      this.server.listen(httpPort, httpHost, resolver);
    });
  }

  static createStatusMsg() {
    const { appName, httpPort } = config;
    return `${appName} is listening on port ${httpPort}`;
  }

  static getInstance() {
    return this.server;
  }

  static stop() {
    process.exit(0);
  }
}
