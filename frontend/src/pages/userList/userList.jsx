// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Box, Flex, Image, Text, Heading, VStack, Link } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/users/", {
//         withCredentials: true,
//       })
//       .then((response) => {
//         setUsers(response.data);
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, []);

//   const handleUserClick = (userId) => {
//     navigate('/user-reservations', { state: { userId } });
//   };

//   return (
//     <Box>
//       <Heading as="h1" size="lg" mb={4}>Users</Heading>
//       <Flex flexWrap="wrap" justifyContent="center">
//         {users.map(user => (
//           <Link key={user.id} to="#" onClick={() => handleUserClick(user.id)}>
//             <Box w="200px" m={4} p={4} bg="white" borderRadius="md" boxShadow="md">
//               <Image src={user.avatar_url} alt={user.username} borderRadius="full" boxSize="100px" mb={4} />
//               <VStack align="center">
//                 <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
//                 <Text fontSize="md" color="gray.500">Email: {user.email}</Text>
//                 <Text fontSize="md" color="gray.500">Phone: {user.phonenumber}</Text>
//               </VStack>
//             </Box>
//           </Link>
//         ))}
//       </Flex>
//     </Box>
//   );
// };

// export default UsersPage;

import React, { useState, useEffect } from "react";

import {
    Container,
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    HStack,
    Radio,
    RadioGroup,
    useToast,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const UserList = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/users/",
                {
                    credentials: "include",
                }
            );
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            console.log("Fetched users:", data);
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async () => {
        try {
            if (selectedUsers.length === 0) {
                toast({
                    title: "Error",
                    description: "Please select Users to delete",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            for (const userId of selectedUsers) {
                const response = await fetch(
                    `http://localhost:8000/api/users/${userId}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(
                        error.detail || `Failed to delete user ${userId}`
                    );
                }
            }

            toast({
                title: "Success",
                description: "Selected users deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setSelectedusers([]);
            setShowDeleteOptions(false);
            fetchusers();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.xl" mt={4} mb={200}>
            <Box
                py={4}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Heading size="lg">User List</Heading>
                <HStack spacing={4}>
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate("/user-create")}
                    >
                        Add User
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={() => setShowDeleteOptions(!showDeleteOptions)}
                    >
                        Delete User
                    </Button>
                    <Button
                        colorScheme="green"
                        onClick={() => navigate("/edit-user")}
                    >
                        Edit Tasks
                    </Button>
                    <Button
                        colorScheme="purple"
                        onClick={() => navigate("/assign-tasks")}
                    >
                        Assign Tasks
                    </Button>
                    <Button
                        colorScheme="teal"
                        onClick={() => navigate("/user-tasks-list")}
                    >
                        View Tasks
                    </Button>
                </HStack>
            </Box>
            <TableContainer mt={8}>
                <Table variant="striped" colorScheme="gray" size="md">
                    <Thead>
                        <Tr>
                            {showDeleteOptions && <Th>Select</Th>}
                            <Th>ID</Th>
                            <Th>Username</Th>
                            <Th>Email</Th>
                            <Th>Phone Number</Th>
                            <Th>Status</Th>
                            <Th>Role</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {/* {users.length === 0 ? (
                            <Tr>
                                <Td
                                    colSpan={showDeleteOptions ? 7 : 6}
                                    textAlign="center"
                                >
                                    No users found
                                </Td>
                            </Tr>
                        ) : ( */}
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <Tr key={user.id}>
                                    {/* {showDeleteOptions && (
                                        <Td>
                                            <RadioGroup
                                                onChange={(value) =>
                                                    setSelectedusers((prev) =>
                                                        prev.includes(value)
                                                            ? prev.filter(
                                                                  (id) =>
                                                                      id !==
                                                                      value
                                                              )
                                                            : [...prev, value]
                                                    )
                                                }
                                            >
                                                <Radio
                                                    value={user.id.toString()}
                                                />
                                            </RadioGroup>
                                        </Td>
                                    )} */}
                                    <Td>{user.id}</Td>
                                    <Td>{user.username}</Td>
                                    <Td>{user.email}</Td>
                                    <Td>{user.phonenumber}</Td>
                                    <Td>
                                        {user.is_active ? "Active" : "Inactive"}
                                    </Td>
                                    <Td>{user.role}</Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={6} textAlign="center">
                                    No users found
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>

            {showDeleteOptions && (
                <Box textAlign="right" mt={4}>
                    <Button colorScheme="red" onClick={handleDelete}>
                        Confirm Delete
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default UserList;
