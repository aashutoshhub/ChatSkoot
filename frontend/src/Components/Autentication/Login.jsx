import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  

  const [show1, setShow1] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleClick1 = () => {
    setShow1(!show1);
  };

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: 'Sorry,Any field cannot be empty!!',
        description: 'Please enter in empty field!!',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }
  };

  const loginSubmitHandler = async () => {
    setLoading(true);

   // console.log('email password', email,password);

    //form validation
    validateForm();

    try {
      const config = {
        Headers: {
          'Content-type': 'application/json'
        }
      };
      const { data } = await axios.post(
        'api/user/login',
        { email, password },
        config
      );

      // console.log("check mongodb");
      // console.log(data);
      if (data) {
        toast({
          title: `${data.name},Welcome to ChatSkoot`,
          description: 'Login Successfull,Have a nice day!!',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'bottom'
        });
        
      } else {
        toast({
          title: `Server Erorr!!`,
          description: 'Please try again to login!!',
          status: 'warning',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
        return;
      }

     // console.log('logged in user data in login : ', data);
      //userInfo data is setting here in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));

      setLoading(false);
     
      navigate('/chat', { replace: true }); //here is problem
      navigate(0);  // after navigating it will refresh the page automatically

    } catch (error) {
      toast({
        title: `Erorr Occured!!`,
        description: error.response.data.message,
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
    }
  };

  const guestSubmitHandler = () => {
    setEmail('guest@gmail.com');
    setPassword('1234');
  };

  return (
    <>
      <VStack spacing='5px'>
        <FormControl id='email' isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type='email'
            value={email}
            placeholder='Please Enter Your Email Address'
            onChange={e => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id='password' isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show1 ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem' onClick={handleClick1}>
              <Button h='1.75rem' size='sm'>
                {show1 ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme='blue'
          width='100%'
          style={{ marginTop: 15 }}
          onClick={loginSubmitHandler}
          isLoading={loading}
        >
          Login
        </Button>

        <Button 
          colorScheme='red'
          width='100%'
          style={{ marginTop: 15 }}
          onClick={guestSubmitHandler}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </>
  );
}

export default Login;
