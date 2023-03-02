import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../Components/Autentication/Login';
import Register from '../Components/Autentication/Register';

function Home() {

  const navigate = useNavigate();
  
  //check if user is logged in navigate to chat 
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      // console.log(user);
      if (user) {
        navigate('/chat', { replace: true });
        navigate(0);  //refresh the page
      }
    }, [navigate]);
  

  return (
    <>
      <Container maxW='xl' centerContent>
        <Box
          d='flex'
          justifyContent='center'
          p={3}
          bg={'white'}
          w='100%'
          m='40px 0 15px 0'
          borderRadius='lg'
          borderWidth='1px'
        >
          <Text
            fontSize='4xl'
            fontFamily='work sans'
            color='black'
            textAlign='center'
          >
            ChatSkoot
          </Text>
        </Box>

        <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
          <Tabs variant='soft-rounded' color='black' colorScheme='green'>
            <TabList mb='1em'>
              <Tab w='50%'>Login</Tab>
              <Tab w='50%'>Register</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
}

export default Home
