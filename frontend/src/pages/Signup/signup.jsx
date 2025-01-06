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
    Stack,
    VStack,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";

// Function to calculate password entropy
const calculatePasswordEntropy = (password) => {
    const characterSets = [
        /[a-z]/, // Lowercase letters
        /[A-Z]/, // Uppercase letters
        /[0-9]/, // Numbers
        /[!@#$%^&*(),.?":{}|<>]/, // Special characters
    ];

    let poolSize = 0;

    characterSets.forEach((regex) => {
        if (regex.test(password)) {
            poolSize += regex.source.length;
        }
    });

    const entropy = password.length * Math.log2(poolSize || 1);
    return entropy;
};

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const entropy = calculatePasswordEntropy(value);

        if (entropy < 28) {
            setPasswordError("Very Weak: Consider using a stronger password.");
        } else if (entropy < 36) {
            setPasswordError("Weak: Add more complexity or length.");
        } else if (entropy < 50) {
            setPasswordError(
                "Medium: A decent password, but could be stronger."
            );
        } else {
            setPasswordError(""); // Strong password
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordError) {
            toast({
                title: "Invalid Password",
                description:
                    "Please use a stronger password before submitting.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);
        const controller = new AbortController();

        try {
            await axios.post(
                "http://localhost:8000/api/users/",
                {
                    email,
                    password,
                },
                {
                    signal: controller.signal,
                }
            );

            toast({
                title: "Signup Successful",
                description: "You have successfully created an account.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setEmail("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            if (!axios.isCancel(error)) {
                toast({
                    title: "Signup Failed",
                    description:
                        error.response?.data?.detail || "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setIsSubmitting(false);
        }

        return () => controller.abort();
    };

    return (
        <Container maxW="md" mt={10}>
            <Box borderWidth={1} borderRadius="lg" p={6}>
                <Heading mb={6}>Sign Up</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={isSubmitting}
                            />
                            {passwordError && (
                                <Box color="red.500" fontSize="sm" mt={1}>
                                    {passwordError}
                                </Box>
                            )}
                        </FormControl>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            width="full"
                            isLoading={isSubmitting}
                        >
                            Sign Up
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default Signup;
