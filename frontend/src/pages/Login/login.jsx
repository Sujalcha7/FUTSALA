import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // Make sure this path is correct
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser } = useAuth(); // Add this line to get setUser from context

    // Configure axios to include credentials
    axios.defaults.withCredentials = true;

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            const controller = new AbortController();
            setIsSubmitting(true);

            try {
                const response = await axios.post(
                    "http://localhost:8000/api/login/",
                    values,
                    {
                        signal: controller.signal,
                        withCredentials: true,
                    }
                );

                // Make sure we're setting the user data correctly
                if (response.data && response.data.user) {
                    setUser(response.data.user);

                    toast({
                        title: "Login Successful",
                        description: "You have successfully logged in.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });

                    // Slight delay before navigation to ensure state is updated
                    setTimeout(() => {
                        navigate("/");
                    }, 500);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Login error:", error);
                    toast({
                        title: "Login Failed",
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
        },
    });

    return (
        <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex="1 0 auto"
            my={10}
        >
            <Stack
                width="30%"
                minW="360px"
                maxW="640px"
                rounded={10}
                p={10}
                direction="column"
                gap={4}
                boxShadow="0 0 30px 0 #38664150"
            >
                <Heading mb={10} color="#1f1f1f">
                    Login
                </Heading>
                <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col gap-4 justify-center items-center"
                >
                    <FormControl isRequired>
                        <FormLabel fontWeight={600}>Email:</FormLabel>
                        <Input
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel fontWeight={600}>Password:</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="100%"
                        isLoading={isSubmitting}
                    >
                        Login
                    </Button>
                    <ChakraLink
                        as={ReactRouterLink}
                        to="/signup"
                        fontWeight={600}
                    >
                        Don't have an account? Register now!
                    </ChakraLink>
                </form>
            </Stack>
        </Box>
    );
};

export default Login;
