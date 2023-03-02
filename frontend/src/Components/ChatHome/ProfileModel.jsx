import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

const ProfileModel = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: 'fles' }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
          )}
          
   {/* this is a modal */}
      <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h='410px' >
                  <ModalHeader
                      fontSize="40px"
                      fontFamily="work sans"
                      display="flex"
                      justifyContent="center"
                  >{user.name}</ModalHeader>
          <ModalCloseButton />
                  <ModalBody
                      display="flex"
                      flexDir="column"
                      alignItems="center"
                      justifyContent="space-between"
                  >
                      <Image
                          borderRadius="full"
                          boxSize="150px"
                          src={user.pic.url}
                          alt={user.name}
                         
                      />
                      <Text
                          fontSize={{ base: '28px', md: '30px' }}
                          fontFamily='Work sans'
                      >Email : {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button  mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModel
