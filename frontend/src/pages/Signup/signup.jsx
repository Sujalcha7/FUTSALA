import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useToast,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const controller = new AbortController();

        try {
            await axios.post(
                "/api/users/",
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
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
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
