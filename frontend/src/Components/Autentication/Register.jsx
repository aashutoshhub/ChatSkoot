import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {

  const navigate = useNavigate();
//chakra ui toast
  const toast = useToast();

    const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();

    const handleClick1 = () => {
        setShow1(!show1);
    }
    const handleClick2 = () => {
      setShow2(!show2);
    };


  // const postImage = (pics) => {
  //   // setLoading(true);
  //   if (pics === undefined) {
  //     toast({
  //       title: 'Please select an image!!',
  //       description: "Sorry,We are not accepting user without their image",
  //       status: 'warning',
  //       duration: 4000,
  //       isClosable: true,
  //       position:"bottom",
  //     });
  //     return;
  //   }

  //   if (pics.type === "image/*") {
  //     setPic(pics);
  //   }     
  //   }
  
  const validateForm = () => {

     if (!name || !email || !password ) {
       toast({
         title: 'Sorry,Any field cannot be empty!!',
         description:
           'Please enter correct data in empty field!!',
         status: 'warning',
         duration: 4000,
         isClosable: true,
         position: 'bottom'
       });
       return;
    }
     if (!pic) {
       toast({
         title: 'Sorry, Please Select profile picture!!',
         description:
           'Select your profile picture to register!!',
         status: 'warning',
         duration: 4000,
         isClosable: true,
         position: 'bottom'
       });
       return;
     }
    //to check password and confirm password field are not matching
    if (confirmPassword !== password) {
      toast({
        title: 'Sorry,your password are not matching',
        description:
          'Please enter correct password in confirm password field!!',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }
  }

  const fileDataChange = (e) => {
     if (e.target.name === 'pic') {
       const reader = new FileReader();

       reader.onload = () => {
         if (reader.readyState === 2) {
           setPic(reader.result);
         }
       };

       reader.readAsDataURL(e.target.files[0]);
     }
  }

  const submitHandler = async(e) => {
    e.preventDefault();

    //form validation
    validateForm();
    setLoading(true); //it start loading


    try {
      const config = {
        Headers: {
          'Content-type': 'multipart/form-data'
        }
      };
      const { data } = await axios.post(
        'api/user/register',
        { name, email, password, pic },
        config
      );

      // console.log("check mongodb");
      // console.log(data);
      if (data) {
        toast({
          title: `${data.name},Welcome to ChatSkoot`,
          description: 'Registration Successfull,Have a nice day!!',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'bottom'
        });
      } else {
        toast({
          title: `Server Erorr!!`,
          description: 'Please try again to register!!',
          status: 'warning',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      }

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);

      navigate('/chat');
      
    } catch (error) {
      toast({
        title: `Erorr Occured!!`,
        description:  error.response.data.message,
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
    }
  }

  return (
    <>
      <VStack spacing='5px'>
        <FormControl id='first-name' isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type='text'
            placeholder='Please Your Name '
            onChange={e => setName(e.target.value)}
          />
        </FormControl>

        <FormControl id='email' isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type='email'
            placeholder='Please Your Email Address '
            onChange={e => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id='password' isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show1 ? 'text' : 'password'}
              placeholder='Password '
              onChange={e => setPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem' onClick={handleClick1}>
              <Button h='1.75rem' size='sm'>
                {show1 ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id='confirmPassword' isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={show2 ? 'text' : 'password'}
              placeholder='Confirm Password '
              onChange={e => setConfirmPassword(e.target.value)}
            />

            <InputRightElement width='4.5rem' onClick={handleClick2}>
              <Button h='1.75rem' size='sm'>
                {show2 ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id='image' isRequired>
          <FormLabel>Upload Your Picture</FormLabel>
          <Input
            type='file'
            p={1.5}
            name='pic'
            accept='image/*'
            // onChange={e => postImage(e.target.files[0])}
            onChange={fileDataChange}
          />
        </FormControl>

        <Button
          colorScheme='blue'
          width='100%'
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
}

export default Register
