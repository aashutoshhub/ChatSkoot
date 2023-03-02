
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const navigate = useNavigate();  
  
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chat, setChat] = useState([]);
  const [notification, setNotification] = useState([]);
  

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        console.log("userinfo",userInfo);

        setUser(userInfo);
    //if user is not there push it to login/register page
      if (!userInfo) {
        navigate('/');
      }
    }, [navigate]);


    return (
      <ChatContext.Provider
        value={{
          user,
          setUser,
          selectedChat,
          setSelectedChat,
          chat,
          setChat,
          notification,
          setNotification
        }}
      >
        {children}
      </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;