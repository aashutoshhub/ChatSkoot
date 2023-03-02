import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getSender } from '../../config/ChatLogic';
import { ChatState } from '../../Context/ChatProvider';
import ChatLoading from './ChatLoading';
import GroupChatmodal from './GroupChatmodal';

function MyChat({ fetchAgain }) {
  
  const [loggedUser, setLoggedUser] = useState();

  //getting from contextapi  //from ChatProvider
  const { user, selectedChat, setSelectedChat, chat, setChat } = ChatState();

  // console.log("selectedChat in mychat:", selectedChat);
  // console.log("user in myChat: ", user);
  console.log('loggeduser in mychat: ', loggedUser);

  const toast = useToast();

  const fetchChats = async () => {
    console.log("user id: ",user._id);
    try {
      const { data } = await axios.get('/api/chat');

      console.log('chat data from mychat', data);

      setChat(data); //setting chats data
      

    } catch (error) {
      toast({
        title: 'Error Occured!!',
        description: 'Failed to load the chats',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-left'
      });
      //return;
    }
  };

  console.log("logged user data directly : ",JSON.parse(localStorage.getItem('userInfo')));

  console.log("fetchAgain: ", fetchAgain);
  
  console.log("chat in mychat : ", chat);

 
  //problem is here
  // useEffect(() => {
  //   const data1 = JSON.parse(localStorage.getItem('userInfo'));
  //   console.log("data1 :", data1);
  //   setLoggedUser(data1);
  //   fetchChats();
  // }, [fetchAgain]);

  useEffect(() => {
    console.log("called useEffect1");
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
      fetchChats();
   }, [fetchAgain]); //fetchAgain changes 


    console.log('loggeduser in mychat : ', loggedUser);
  // console.log("Chat in mychat : ", chat);
  // console.log('selected chat in mychat : ', selectedChat);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
    >
      {/* for heading in box */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily='Work sans'
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
      
        {/* for group chat modal  */}
        <GroupChatmodal>
          <Button
            display='flex'
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatmodal>
      </Box>

      {/* rendering all the chats  */}
      <Box
        display='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chat ? (
          <Stack overflowY='scroll'>
            {chat.map(chat => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>

                {chat.latestMessage && (
                  <Text fontSize='xs'>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + '...'
                      : chat.latestMessage.content}
                  </Text>
                )}

              </Box>
            ))}
          </Stack>

        ) : (
            
            <ChatLoading />
            
        )}
      </Box>
    </Box>
  );
};

export default MyChat
