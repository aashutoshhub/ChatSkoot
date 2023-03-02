const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require('../Models/UserModel');
const cloudinary = require('cloudinary');
const Message = require('../Models/MessageModel');
const Chat = require('../Models/ChatModel');


exports.sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("invalid data passed into request");
        return res.sendStatus(400);
    }

    let newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    };

    try {
        let message = await Message.create(newMessage);

        // console.log("message created : ", message);

        message = await message.populate("sender", "name pic");
          
        // console.log('date after populating from sender : ', message);

        message = await message.populate('chat');
        //  console.log('date after populating from chat : ', message);

        message = await User.populate(message, {
            path: "chat.users",
            select:"name pic email",
        });

        //  console.log('date from User using message : ', message);


        //to update latest message
        await Chat.findByIdAndUpdate(req.body.chatId, {
          latestMessage:message,
        });

        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }


}) 

exports.getMessages = asyncHandler(async (req, res) => {
    try {
        let message = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email pic")
            .populate("chat");

        res.json(message);
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})