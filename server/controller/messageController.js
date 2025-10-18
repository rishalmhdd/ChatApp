//get all user except loggedin user

import cloudinary from "../lib/cloudinary.js";
import messagesModel from "../models/Messages.js";
import userModel from "../models/User.js";
import { io, userSocketMap } from "../server.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all other users except the logged-in one
    const filteredUser = await userModel
      .find({ _id: { $ne: userId } })
      .select("-password");

    // Count unseen messages
    const unseenMessages = {};

    const promises = filteredUser.map(async (user) => {
      const messages = await messagesModel.find({
        senderId: user._id,
        recieverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUser,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


//get all messages for selected user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await messagesModel.find({
      $or: [
        { senderId: myId, recieverId: selectedUserId },
        { senderId: selectedUserId, recieverId: myId },
      ],
    });
    await messagesModel.updateMany(
      { senderId: selectedUserId, recieverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//mark message as seen

export const markMessageSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await messagesModel.findByIdAndUpdate(id, { seen: true });
    res.json({});
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await messagesModel.create({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });
    res.json({ success: true, newMessage });

    const reciverSocketId = userSocketMap[recieverId];
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("new Message", newMessage);
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
