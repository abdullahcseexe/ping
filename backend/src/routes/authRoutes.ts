// import { Router } from "express";
// import { authCallback, getMe } from "../controllers/authController";
// import { protectRoute } from "../middleware/auth";

// const router = Router();

// router.get("/me", protectRoute, getMe);
// router.post("/callback", authCallback);

// export default router;

import { Router } from "express";
import { authCallback, getMe } from "../controllers/authController";
import { protectRoute } from "../middleware/auth";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/me", protectRoute, getMe);
router.post("/callback", requireAuth(), authCallback);

export default router;