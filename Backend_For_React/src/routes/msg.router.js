import { Router } from "express";
import { sendMsg,getMsg ,sendMsg_urlValidator} from "../controllers/msg.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const MsgRouter = Router();

MsgRouter
.post('/sendMessage',sendMsg)
.get('/reciverValidate', sendMsg_urlValidator);