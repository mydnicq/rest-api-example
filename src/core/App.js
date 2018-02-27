import express from "express";
import Database from "./Database";
import { authMiddleware, errorMiddleware } from "../middlewares";
import { rootRouter, meRouter, userRouter } from "../routes";

export default class App {
  constructor() {
    this.app = "";
  }

  async start() {
    this.app = express();

    await Database.init();

    this.app.use(express.json());

    authMiddleware.init(this.app);

    this.app.use("/", rootRouter);
    this.app.use("/me", meRouter);
    this.app.use("/user", userRouter);

    errorMiddleware.init(this.app);

    return this.app;
  }

  // eslint-disable-next-line class-methods-use-this
  stop() {
    Database.destroy();
  }
}
