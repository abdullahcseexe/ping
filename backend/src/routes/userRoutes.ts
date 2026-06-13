


// import { Router } from "express";
// import { protectRoute } from "../middleware/auth";
// import { getUsers, deleteMe } from "../controllers/userController";

// const router = Router();

// router.use(protectRoute);

// router.get("/", getUsers);
// router.delete("/me", deleteMe);

// export default router;


import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getUsers, deleteMe, updateMe } from "../controllers/userController";

const router = Router();

router.use(protectRoute);

router.get("/", getUsers);
router.patch("/me", updateMe);
router.delete("/me", deleteMe);

export default router;

