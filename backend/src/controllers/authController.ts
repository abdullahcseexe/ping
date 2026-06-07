// import type { NextFunction, Request, Response } from "express";
// import type { AuthRequest } from "../middleware/auth";
// import { User } from "../models/User";
// import { clerkClient, getAuth } from "@clerk/express";

// export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
//   try {
//     const userId = req.userId;

//     const user = await User.findById(userId);

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500);
//     next(error);
//   }
// }

// export async function authCallback(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { userId: clerkId } = getAuth(req);

//     if (!clerkId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     let user = await User.findOne({ clerkId });

//     if (!user) {
//       // get user info from clerk and save to db
//       const clerkUser = await clerkClient.users.getUser(clerkId);

//       user = await User.create({
//         clerkId,
//         name: clerkUser.firstName
//           ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
//           : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0],
//         email: clerkUser.emailAddresses[0]?.emailAddress,
//         avatar: clerkUser.imageUrl,
//       });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500);
//     next(error);
//   }
// }

import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

// Protected by requireAuth() only (not full protectRoute) — this route
// is responsible for creating the user on first sign-in, so we can't
// run the User.findOne check that protectRoute does.
export async function authCallback(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // First sign-in: fetch profile from Clerk and persist to DB
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await User.create({
        clerkId,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0],
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: clerkUser.imageUrl,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}