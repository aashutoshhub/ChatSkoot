import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../User/UserBadgeItem';
import UserListItem from '../User/UserListItem';


function UpdateGroupChatModel({ fetchAgain, setFetchAgain, fetchChats }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  console.log('selected chat in updategroupmodel: ', selectedChat);
  console.log('user : ', user);

  const handleSearch = async query => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`/api/user?search=${search}`);

      console.log('search data in groupchat: ', data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured!!',
        description: error.resonse.data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top'
      });
      return;
    }
  };

  const handleAddUser = async user1 => {
    if (selectedChat.users.find(u => u._id === user1._id)) {
      toast({
        title: 'User already added!!',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user.id) {
      toast({
        title: 'Only Admin Can Add Someone!!',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const { data } = await axios.post(
        '/api/chat/groupadd',
        {
          chatId: selectedChat._id,
          userId: user1._id
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      console.log('added user data: ', data);
      toast({
        title: `${user1.name} is added in the group!!"`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      toast({
        title: 'Error Occured!!',
        description: error.resonse.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      return;
    }
  };

  const handleRemove = async user1 => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'Only Admin Can Remove Someone!!',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const { data } = await axios.post(
        '/api/chat/groupremove',
        {
          chatId: selectedChat._id,
          userId: user1._id
        },
        config
      );

      //if user admin left group  //changes in id to _id
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchChats();  // it fetches chat after any user get removed 
      setLoading(false);
      console.log('removed user data: ', data);
      toast({
        title: `${user1.name} is removed from the group!!"`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      toast({
        title: 'Error Occured!!',
        description: error.resonse.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      return;
    }
  };

  const handleRenameGroupName = async () => {
    if (!groupChatName) {
      toast({
        title: 'Please Type New Group Chat Name',
        description: 'Sorry,Blank name cannout be update!!',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      };

      const { data } = await axios.put(
        '/api/chat/rename',
        JSON.stringify({
          chatId: selectedChat._id,
          chatName: groupChatName
        }),
        config
      );

      console.log('group updated data : ', data);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain); // to update in ui
      setRenameLoading(false);

      toast({
        title: 'Group Name Updated Successfully',
        status: 'success',
        duration: 1000,
        isClosable: true,
        position: 'top'
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error Occured!!',
        description: 'Failed to Rename Group chat name.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top'
      });

      setRenameLoading(false);
    }

    setGroupChatName('');
  };

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        display={{ base: 'flex' }}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >
            {selectedChat.chatName.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box w='100%' display='flex' flexWrap='wrap'>
              {selectedChat.users.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display='flex'>
              <Input
                placeholder='Group Chat Name'
                mb={3}
                ml={1}
                mr={2}
                value={groupChatName}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <Button
                variant='solid'
                colorScheme='whatsapp'
                isLoading={renameLoading}
                onClick={handleRenameGroupName}
              >
                Update
              </Button>
            </FormControl>

            <FormControl display='flex'>
              <Input
                placeholder='Add User To Group.'
                mb={3}
                ml={1}
                mr={1}
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* Render search users // it render the search */}
            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              {/* problem in id and _id of user  */}
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModel
