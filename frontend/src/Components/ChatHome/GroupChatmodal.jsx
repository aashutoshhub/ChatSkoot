import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../User/UserBadgeItem';
import UserListItem from '../User/UserListItem';

function GroupChatmodal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

    const toast = useToast();
    
  //getting from contextapi  //from ChatProvider
    const { user, selectedChat, setSelectedChat, chat, setChat } = ChatState();
    
  console.log("selected chat in groupchatmodel: ", selectedChat);
  
    const handleSearch = async(query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`/api/user?search=${search}`);

            console.log("search data in groupchat: ",data);
            setLoading(false);
            setSearchResults(data);

        } catch (error) {
             toast({
               title: 'Error Occured!!',
               description: 'Failed to load your search results',
               status: 'error',
               duration: 4000,
               isClosable: true,
               position: 'top'
             });
             return;
        }
    }

    const handleSubmit = async() => {
        if (!groupChatName || !selectedUsers) {
            toast({
              title: 'Please fill all the field!!',
              description: `Hey ${user.name} ,you try to create group without having group name.`,
              status: 'warning',
              duration: 4000,
              isClosable: true,
              position: 'top'
            });
            return; 
        }

        //if any field is not empty
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
          const { data } = await axios.post(
            '/api/chat/group',
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map(u => u._id))
            },
            config
          );

          //data is at fist in order to create at very first
            setChat([data, ...chat]);
            onClose();

            toast({
              title: `${groupChatName} group chat created`,
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'bottom'
            });
            return;

        } catch (error) {
            toast({
              title: 'Failed to create chat!!',
              description: `Error : ${error.response.data}`,
              status: 'error',
              duration: 4000,
              isClosable: true,
              position: 'bottom'
            });
            return;
        }

    }

    const handleGroup = (userToAdd) => {

        if (selectedUsers.includes(userToAdd)) {
             toast({
               title: 'User already added!!',
               status: 'warning',
               duration: 4000,
               isClosable: true,
               position: 'top'
             });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);

    };

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
    }

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl>
              <Input
                placeholder='Group Name....'
                mb={3}
                onChange={e => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add user....      Eg: Aashutosh, Amit, Ram, ....'
                mb={1}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* Selected users here  */}
            <Box w="100%" display="flex" flexWrap="wrap" >
              {selectedUsers.map(u => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* Render search users // it render the search */}
            {loading ? (
              <div>loading</div>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatmodal
