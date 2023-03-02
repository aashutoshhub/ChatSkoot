const jwt = require('jsonwebtoken');
require('dotenv').config(); // .config() load process.env file


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = generateToken;