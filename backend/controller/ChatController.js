const asyncHandler = require('express-async-handler');
const Chat = require('../Models/ChatModel');
const User = require('../Models/UserModel');


exports.accessChat = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("userId params not sent with request");
        return res.send.status(400);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    })
        .populate('users', '-password')
        .populate('latestMessage');
    
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select:'name pic email',
    });

    //if chat exits then it show else create new 
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users:[req.user._id,userId]
        };

        try {
            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({
                _id: createdChat._id
            }).populate('users', '-password');

            res.status(200).send(fullChat);

        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }

    }
     
})

//22:56 - 10


exports.fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name pic email'
                });

                res.status(200).send(results);
            });
            //.then(result => res.send(result));
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

//group chat creation controller
exports.createGroup = asyncHandler(async (req, res) => {
    
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "please fill all the fields" });
    }

    //converting string to object
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    //push in array of all users and current loggedin user
    users.push(req.user);

    //now creating groupchat and saving to database
    try {
        //saving to database
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        //now fetching from db to show 
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


exports.renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    
    if (!updatedChat) {
        res.status(400);
        throw new Error("chat not found!!");
    } else {
        res.json(updatedChat);
    }
})

//add to group controller
exports.addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        {
            new: true
        }
    )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

    if (!added) {
        res.status(400);
        throw new Error('chat not found!!');
    } else {
        res.json(added);
    }
});


//remove from group controller
exports.removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId }
    },
    {
      new: true
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(400);
    throw new Error('chat not found!!');
  } else {
      res.json(removed);
  }
});