// import type { Response, NextFunction } from "express";
// import type { AuthRequest } from "../middleware/auth";
// import { Message } from "../models/Message";
// import { Chat } from "../models/Chat";

// export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
//   try {
//     const userId = req.userId;
//     const { chatId } = req.params;

//     const chat = await Chat.findOne({
//       _id: chatId,
//       participants: userId,
//     });

//     if (!chat) {
//       res.status(404).json({ message: "Chat not found" });
//       return;
//     }

//     const messages = await Message.find({ chat: chatId })
//       .populate("sender", "name email avatar")
//       .sort({ createdAt: 1 }); // oldest first

//     res.json(messages);
//   } catch (error) {
//     res.status(500);
//     next(error);
//   }
// }

import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";

export async function deleteMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    // sender is stored as ObjectId — compare string representations
    const senderId = message.sender?.toString();
    if (senderId !== userId) {
      res.status(403).json({ message: "You can only delete your own messages" });
      return;
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
}
