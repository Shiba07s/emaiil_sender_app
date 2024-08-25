import { Router } from "express";
import { sendMail } from "../controllers/mail";

const router = Router();

router.post("/send-email", sendMail);

export default router;
