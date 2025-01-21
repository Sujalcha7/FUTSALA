import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";

const EmployeeCreation = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(
                "http://localhost:8000/api/signup/employee",
                {
                    email,
                    username,
                    phonenumber,
                    password,
                }
            );

            toast({
                title: "Employee Created",
                description: "The employee has been successfully created.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setEmail("");
            setUsername("");
            setPhonenumber("");
            setPassword("");
            navigate("/employee-list");
        } catch (error) {
            toast({
                title: "Creation Failed",
                description: error.response?.data?.detail || "An error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxW="600px" py={10}>
            <Box bg="white" p={6} borderRadius="md" boxShadow="md">
                <Heading mb={4} textAlign="center">Create Employee</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormControl id="phonenumber" isRequired>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                type="text"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            colorScheme="teal"
                            width="full"
                            isLoading={isSubmitting}
                        >
                            Create Employee
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default EmployeeCreation;