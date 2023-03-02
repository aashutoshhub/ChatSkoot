
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Models/UserModel');

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;

    // console.log(token);
    if (!token) {
        res.status(400);
        throw new Error('not found token');
    }

    try {
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decodeData);

        req.user = await User.findById(decodeData.id).select('-password');

        console.log(req.user);

        next();
    } catch (error) {
        res.status(400);
        throw new Error("Not Authorized, token failed");
    }
});

module.exports = isAuthenticated;
