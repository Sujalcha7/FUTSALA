import React from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Animation for the 404 error
const MotionBox = motion(Box);

const NotFound = () => {
  return (
    <VStack spacing={8} justify="center" align="center" height="100vh">
      <MotionBox
        fontSize="10xl"
        fontWeight="bold"
        color="teal.400"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'loop' }}
      >
        404
      </MotionBox>
      <Text fontSize="2xl" textAlign="center">
        Oops! The page you are looking for does not exist.
      </Text>
      <Button colorScheme="teal" size="lg" onClick={() => window.location.href = '/'}>
        Go Back Home
      </Button>
    </VStack>
  );
};

export default NotFound;
