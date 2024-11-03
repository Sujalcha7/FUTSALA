import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useToast } from "@chakra-ui/react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Container,
    Heading,
    Link as ChakraLink,
    Stack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            const controller = new AbortController();
            setIsSubmitting(true);

            try {
                await axios.post("http://localhost:8000/api/login/", values, {
                    signal: controller.signal,
                });
                toast({
                    title: "Login Successful",
                    description: "You have successfully logged in.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                if (!axios.isCancel(error)) {
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

    useEffect(() => {
        return () => {
            if (isSubmitting) {
                formik.setSubmitting(false);
            }
        };
    }, [isSubmitting, formik]);

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
                    <Button type="submit" colorScheme="blue" width="100%">
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
