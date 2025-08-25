import { register, login,loginStatusCheck,logout } from "../controllers/user.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const UserRouter = Router(); // Changed UserRouter to userRouter

UserRouter
  .post('/register', register)
  .post('/login', login)
  .post('/logout',authMiddleware,logout)
  .get('/verify',authMiddleware,loginStatusCheck);

