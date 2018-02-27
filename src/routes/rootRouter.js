import express from "express";
import { AuthService, UserService } from "../services";
import asyncHanlder from "../utils/asyncHandler";
import { paginateMiddleware } from "../middlewares";

const router = express.Router();
export default router;

router.post(
  "/signup",
  asyncHanlder(async (req, res, next) => {
    try {
      await AuthService.signup(req);
      res.status(201).end();
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/login",
  asyncHanlder(async (req, res, next) => {
    try {
      const result = await AuthService.login(req);
      res.json(result);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/most-liked",
  paginateMiddleware,
  asyncHanlder(async (req, res) => {
    const result = await UserService.getMostLiked(req);
    res.json(result);
  })
);
