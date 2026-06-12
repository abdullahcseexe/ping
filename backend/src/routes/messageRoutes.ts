// import { Router } from "express";
// import { protectRoute } from "../middleware/auth";
// import { getMessages } from "../controllers/messageController";

// const router = Router();

// router.get("/chat/:chatId", protectRoute, getMessages);

// export default router;

import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getMessages, deleteMessage } from "../controllers/messageController";

const router = Router();

router.use(protectRoute);

router.get("/chat/:chatId", getMessages);
router.delete("/:messageId", deleteMessage);

export default router;