import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/ChatHome/SideDrawer';
import MyChat from '../Components/ChatHome/MyChat';
import ChatBox from '../Components/ChatHome/ChatBox';
import { useNavigate } from 'react-router-dom';

function Chat() {
  const navigate = useNavigate();
  navigate(0); //refresh the page automatically

  //getting from contextapi  //from ChatProvider
  const { user, setUser } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  console.log('user in chat ', user);
  console.log('checking----------');

  return (
    <>
      <div style={{ width: '100%' }}>
        {user && <SideDrawer />}

        <Box
          display='flex'
          justifyContent='space-between'
          w='100%'
          h='91.5vh'
          p='10px'
        >
          {user && <MyChat fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
    
  );
}

export default Chat;
