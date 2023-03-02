import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';
import { ChatState } from '../../Context/ChatProvider';

import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../User/UserListItem'; 

import { getSender } from '../../config/ChatLogic';

import { Effect } from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';



function SideDrawer() {
  //getting from contextapi  //from ChatProvider
  const {
    user,
    selectedChat,
    setSelectedChat,
    chat,
    setChat,
    notification,
    setNotification
  } = ChatState();

  console.log("chat in side drawer : ", chat);

  const navigate = useNavigate();

  //logout handler
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        description: 'Type something in search input to search',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top-left'
      });
      return;
    }

    //if any search value is there call api to search
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/user?search=${search}`);

      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured!!',
        description: 'Failed to load your search results',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-left'
      });
      return;
    }
  };

  //access user chat
  const accessChat = async userId => {
    //console.log(userId);
    try {

      setLoadingChat(true);

      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      };

      const { data } = await axios.post('/api/chat', { userId }, config);
      
      //if chat state is already in chatlist of Mychats then append it
      console.log("chat", chat);
      if (!chat.find((c) => c._id === data._id)) {
        setChat([data, ...chat]);
      }

      //console.log("created chat: ",data);

      //setting selected chat so that it is accessible in whole of app
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

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

 
  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        width='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <i class='fa-sharp fa-solid fa-magnifying-glass'></i>

            <Text display={{ base: 'none', md: 'flex' }} px='4'>
              {' '}
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize='2xl' fontFamily='work sans'>
          ChatSkoot
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize='2xl' m={2} />
            </MenuButton>

            <MenuList pl={4}>
              {!notification.length && 'No New Messages'}
              {notification.map(notify => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notification.filter(n => n !== notify));
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `New Messages From ${notify.chatName}`
                    : `New Message From ${getSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {/* if url pic is not available then it show first letter of firstname and last letter of last name */}
              <Avatar
                size='sm'
                cursor='pointer'
                name={user.name}
                src={user.pic.url}
              />
            </MenuButton>

            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>

              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* for drawer  */}

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'> Search Users</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pd={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
