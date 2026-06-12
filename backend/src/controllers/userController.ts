// import type { Response, NextFunction } from "express";
// import type { AuthRequest } from "../middleware/auth";
// import { User } from "../models/User";

// export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
//   try {
//     const userId = req.userId;

//     const users = await User.find({ _id: { $ne: userId } })
//       .select("name email avatar")
//       .limit(50);

//     res.json(users);
//   } catch (error) {
//     res.status(500);
//     next(error);
//   }
// }


import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { clerkClient, getAuth } from "@clerk/express";

export async function deleteMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    // Get the clerkId from the user record before deleting
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const clerkId = user.clerkId;

    // Remove user from all chats; delete chats where they are the only remaining participant
    const userChats = await Chat.find({ participants: userId });
    for (const chat of userChats) {
      if (chat.participants.length <= 2) {
        await Message.deleteMany({ chat: chat._id });
        await Chat.findByIdAndDelete(chat._id);
      } else {
        await Chat.findByIdAndUpdate(chat._id, { $pull: { participants: userId } });
      }
    }

    // Delete all messages sent by this user in any remaining chats
    await Message.deleteMany({ sender: userId });

    // Delete MongoDB user record
    await User.findByIdAndDelete(userId);

    // Delete Clerk account (must come last — invalidates auth tokens)
    await clerkClient.users.deleteUser(clerkId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);

    res.json(users);
  } catch (error) {
    res.status(500);
    next(error);
  }
}
