import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Flex, Image, Text, Heading, VStack, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users/", {
        withCredentials: true,
      })
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUserClick = (userId) => {
    navigate('/user-reservations', { state: { userId } });
  };

  return (
    <Box>
      <Heading as="h1" size="lg" mb={4}>Users</Heading>
      <Flex flexWrap="wrap" justifyContent="center">
        {users.map(user => (
          <Link key={user.id} to="#" onClick={() => handleUserClick(user.id)}>
            <Box w="200px" m={4} p={4} bg="white" borderRadius="md" boxShadow="md">
              <Image src={user.avatar_url} alt={user.username} borderRadius="full" boxSize="100px" mb={4} />
              <VStack align="center">
                <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
                <Text fontSize="md" color="gray.500">Email: {user.email}</Text>
                <Text fontSize="md" color="gray.500">Phone: {user.phonenumber}</Text>
              </VStack>
            </Box>
          </Link>
        ))}
      </Flex>
    </Box>
  );
};

export default UsersPage;