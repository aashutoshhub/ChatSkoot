const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require('../Models/UserModel');
const cloudinary = require('cloudinary');

require('dotenv').config(); // .config() load process.env file

exports.registerUser = asyncHandler(async (req, res, next) => {
  //console.log(req.body);

  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const existUser = await User.findOne({ email });

  if (existUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  //upload pic to cloudinary
  const myCloud = await cloudinary.v2.uploader.upload(req.body.pic, {
    folder: 'user_pics',
    width: 150,
    crop: 'scale'
  });

  const user = await User.create({
    name,
    email,
    password,
    pic: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }
  });

  //generating token
  const token = generateToken(user._id);
  //set cookies
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  res.cookie('token', token, options); //setting cookie
  //

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: token
    });
  } else {
    res.status(400);
    throw new Error('Failed to create User');
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const user = await User.findOne({ email });

  const isMatch = await user.matchPassword(password);

  //generating token
  const token = generateToken(user._id);
  //set cookies
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  res.cookie('token', token, options); //setting cookie
  //

  if (user && isMatch) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: token
    });
  } else {
    res.status(400);
    throw new Error('Not Found');
  }
});

//get all users  // /api/user?search=aashutosh
exports.allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } }, //i represent case-insensitive
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  // console.log(keyword);

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});
