"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mail_1 = require("../controllers/mail");
const router = (0, express_1.Router)();
router.post("/send-email", mail_1.sendMail);
exports.default = router;
//# sourceMappingURL=index.js.map