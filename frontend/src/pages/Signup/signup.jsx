import React from "react";
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
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

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
    const toast = useToast();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validate: (values) => {
            const errors = {};
            const entropy = calculatePasswordEntropy(values.password);

            if (entropy < 28) {
                errors.password =
                    "Very Weak: Consider using a stronger password.";
            } else if (entropy < 36) {
                errors.password = "Weak: Add more complexity or length.";
            } else if (entropy < 50) {
                errors.password =
                    "Medium: A decent password, but could be stronger.";
            }

            return errors;
        },
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            const controller = new AbortController();

            try {
                await axios.post(
                    "http://localhost:8000/api/users/",
                    {
                        email: values.email,
                        password: values.password,
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

                // Navigate to login page after successful signup
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
                setSubmitting(false);
            }

            return () => controller.abort();
        },
    });

    return (
        <Container maxW="md" mt={10}>
            <Box borderWidth={1} borderRadius="lg" p={6} mb={450}>
                <Heading mb={6}>Sign Up</Heading>
                <form onSubmit={formik.handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl
                            id="email"
                            isRequired
                            isInvalid={
                                formik.touched.email && formik.errors.email
                            }
                        >
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                        </FormControl>
                        <FormControl
                            id="password"
                            isRequired
                            isInvalid={
                                formik.touched.password &&
                                formik.errors.password
                            }
                        >
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.password &&
                                formik.errors.password && (
                                    <Box color="red.500" fontSize="sm" mt={1}>
                                        {formik.errors.password}
                                    </Box>
                                )}
                        </FormControl>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            width="full"
                            isLoading={formik.isSubmitting}
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
