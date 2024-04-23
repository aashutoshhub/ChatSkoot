import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getSender, getSenderFull } from '../../config/ChatLogic';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import '../../Components/style.css';
import ScrollableChat from '../ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'lottie-react';
import TypingAnimation from '../../animations/typing.json';

const ENDPOINT = 'http://localhost:8000'; //replace with vercel link

let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnection, setSocketConnection] = useState(false);

  const { user, selectedChat, setSelectedChat,notification, setNotification } = ChatState();

  // console.log("user in single chat: ", user);
 // console.log('selected chats in single chat: ', selectedChat);
  //console.log('messages : ', messages);

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: TypingAnimation,
  //   rendererSettings: {
  //     preserveAspectRatio:"xMidYMid slice",
  //   },
  // };

  //fetching the chats
  const fetchChats = async () => {
    //if no any chat is selected, return simply
    if (!selectedChat) return;

    //fetching data
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`);
      console.log('fetched data of messages : ', data);
      setMessages(data);
      setLoading(false);

      //creating room on selected chat id
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occured!!',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-left'
      });
      return;
    }
  };

  //for socket
  useEffect(() => {
    socket = io(ENDPOINT); 
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnection(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  console.log(notification, "---------------------");

  useEffect(() => {
    fetchChats();

    //it is used to compare chat message for notification
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  //for message update
  useEffect(() => {
    socket.on('message received', newMessageReceived => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }

      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  

  //to send message
  const sendMessage = async event => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json'
          }
        };

        // it won't effect newMessage bcz it is async function
        setNewMessage('');

        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id
          },
          config
        );

        console.log('message from sender : ', data);

        //to send new message to socket
        socket.emit('new message', data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error Occured!!',
          description: error.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-left'
        });
        return;
      }
    }
  };

  //typing handler
  const typeingHandler = (e) => {
    setNewMessage(e.target.value);

    //typing indicator logic
    if (!socketConnection) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    var lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);


  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {/* 32:20  */}
            {/* if not a group chat  */}
            {selectedChat && !selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {/* if it is group chat  */}
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchChats={fetchChats}
                />
              </>
            )}
          </Text>

          {/* for chat box  */}
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#f0eded'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <>
                {/* messages style  */}
                <div className='messages'>
                  <ScrollableChat messages={messages} />
                </div>
              </>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <>
                  <Lottie
                    loop={true}
                    autoplay={true}
                    animationData={TypingAnimation}
                    style={{
                      width: '70px',
                      height: '70px',
                      marginBottom: 15,
                      marginLeft: 0
                    }}
                  />
                </>
              ) : (
                <></>
              )}

              <Input
                variant='filled'
                bg='#E0E0E0'
                placeholder='Enter a message....'
                onChange={typeingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          h='100%'
        >
          <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
            Hey {user.name}, Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat
