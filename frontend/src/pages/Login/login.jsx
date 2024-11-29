import React, { useState } from "react";
import { useFormik } from "formik";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import axios from "axios";
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

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser } = useAuth();

    // Ensure axios always sends credentials
    axios.defaults.withCredentials = true;

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            setIsSubmitting(true);

            try {
                const response = await axios.post(
                    "http://localhost:8000/api/login/",
                    values,
                    {
                        withCredentials: true, // Crucial for cookie-based auth
                    }
                );

                if (response.data && response.data.user) {
                    setUser(response.data.user);

                    toast({
                        title: "Login Successful",
                        description: "You have successfully logged in.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });

                    navigate("/");
                } else {
                    throw new Error("Invalid login response");
                }
            } catch (error) {
                console.error("Login error:", error);
                toast({
                    title: "Login Failed",
                    description:
                        error.response?.data?.detail || "An error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
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
                <form onSubmit={formik.handleSubmit}>
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight={600}>Email:</FormLabel>
                        <Input
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                    </FormControl>
                    <FormControl isRequired mb={4}>
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
                        display="block"
                        mt={4}
                        textAlign="center"
                    >
                        Don't have an account? Register now!
                    </ChakraLink>
                </form>
            </Stack>
        </Box>
    );
};

export default Login;
