import express from "express";
import { ProfileService } from "../services";
import asyncHanlder from "../utils/asyncHandler";
import { authJwt } from "../middlewares/authMiddleware";

const router = express.Router();
export default router;

router.get(
  "/",
  authJwt(),
  asyncHanlder(async (req, res) => {
    const result = await ProfileService.getUserProfileData(req);
    res.json(result);
  })
);

router.put(
  "/update-password",
  authJwt(),
  asyncHanlder(async (req, res) => {
    await ProfileService.updatePassword(req);
    res.status(204).end();
  })
);
