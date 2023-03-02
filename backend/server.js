const express = require('express');
const connectDB = require('./config/db');
const chats = require('./data/data');
const { NotFound, errorHandler } = require('./middleware/errorMiddleware');

const userRoute = require('./Routes/UserRoute');
const chatRoute = require('./Routes/chatRoute');
const messageRoute = require('./Routes/messageRoute');

const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');

const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const path = require('path');

const app = express();
require('dotenv').config(); // .config() load process.env file

//database connection
connectDB();
app.use(express.json()); //as we are accepting json so
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const port = process.env.PORT || 9000;

//for production check
// if (process.env.NODE_ENV !== 'PRODUCTION') {
//   require('dotenv').config(); // .config() load process.env file
// }

// app.get('/', (req, res) => {
//   res.send('Api is running');
// });

// app.get('/api/chat', (req, res) => {
//   res.send(chats);
// });

// app.get('/api/chat/:id', (req, res) => {
//   let singleChat = chats.find(c => c._id === req.params.id);
//   res.send(singleChat);
// });

//routes
app.use('/api/user', userRoute);

app.use('/api/chat', chatRoute);

app.use('/api/message', messageRoute);

// app.use(NotFound);
// app.use(errorHandler);

//console.log(process.env.NODE_ENV);

//for production  to vercel

 console.log(path.join(__dirname, '../frontend/build'));
 app.use(express.static(path.join(__dirname, '../frontend/build')));
 app.get('/*', (req, res) => {
   res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
 });

// if (process.env.NODE_ENV === 'PRODUCTION') {
  
//   console.log(path.join(__dirname, '../frontend/build'));
//   app.use(express.static(path.join(__dirname,"../frontend/build")));
//   app.get('/*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
//   });

// } else {
//   app.get('/', (req, res) => {
//     res.send('Api is running');
//   });
// }


const server = app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000, //it is the time after which socket connection become inactive
  cors: {
    origin: 'https://chatskoot-pl8l.vercel.app/'  //
  }
});

//This event is fired upon a new connection. The first argument is a Socket instance.
io.on('connection', socket => {
  console.log('Connected to socket.io');

  //connect and create room server socket to frontend to particular user and get userdata
  socket.on('setup', userData => {
    socket.join(userData._id);
    //console.log(userData._id);
    socket.emit('connected');
  });

  //joining chat to particular room
  socket.on('join chat', room => {
    socket.join(room);
    console.log('user joined room id : ', room);
  });

  socket.on('new message', newMessageReceived => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users is not defined');

    //to send message to other only except sender
    chat.users.forEach(user => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  //for typing creating socket
  socket.on('typing', room => socket.in(room).emit('typing'));
  socket.on('stop typing', room => socket.in(room).emit('stop typing'));

  socket.off('setup', () => {
    console.log('user disconnected from socket');
    socket.leave(userData._id);
  });
});
