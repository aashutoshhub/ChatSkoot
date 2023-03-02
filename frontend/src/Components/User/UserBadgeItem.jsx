import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react'

function UserBadgeItem({ user, handleFunction }) {
    return (
      <>
        <Box
          px={2}
          py={1}
          borderRadius='lg'
          m={1}
          mb={2}
          variant='solid'
          fontSize={12}
          backgroundColor='#00bd5b'
          color='white'
          cursor='pointer'
        >
          {user.name}
          <CloseIcon color='red' onClick={handleFunction} pl={1} />
        </Box>
      </>
    );
}

export default UserBadgeItem
