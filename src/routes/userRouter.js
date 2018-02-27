import express from "express";
import { UserService, LikeService } from "../services";
import asyncHanlder from "../utils/asyncHandler";
import { authJwt } from "../middlewares/authMiddleware";

const router = express.Router();
export default router;

router.get(
  "/:id/",
  asyncHanlder(async (req, res) => {
    const result = await UserService.getUserById(req);
    res.json(result);
  })
);

router.post(
  "/:id/like",
  authJwt(),
  asyncHanlder(async (req, res) => {
    await LikeService.like(req);
    res.status(204).end();
  })
);

router.post(
  "/:id/unlike",
  authJwt(),
  asyncHanlder(async (req, res) => {
    await LikeService.unlike(req);
    res.status(204).end();
  })
);
