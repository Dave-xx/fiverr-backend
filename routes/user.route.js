import express from "express";
import {
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, getUser);
router.delete("/:id", verifyToken, deleteUser);
router.put("/:id", verifyToken, updateUser);

export default router;
