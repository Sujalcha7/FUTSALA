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
    Text,
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

const EmployeeCreation = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const toast = useToast();

    // Real-time email validation
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!value) {
            setErrors((prev) => ({ ...prev, email: "Email is required" }));
        } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            setErrors((prev) => ({ ...prev, email: "Enter a valid email" }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.email;
                return newErrors;
            });
        }
    };

    // Real-time phone number validation
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        if (value.length <= 10) {
            setPhonenumber(value);
        }

        if (!value) {
            setErrors((prev) => ({ ...prev, phonenumber: "Phone number is required" }));
        } else if (value.length !== 10) {
            setErrors((prev) => ({ ...prev, phonenumber: "Phone number must be exactly 10 digits" }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.phonenumber;
                return newErrors;
            });
        }
    };

    // Real-time password validation
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const entropy = calculatePasswordEntropy(value);
        if (entropy < 28) {
            setPasswordStrength("🔴 Very Weak: Use a stronger password.");
        } else if (entropy < 36) {
            setPasswordStrength("🟠 Weak: Add more variety or length.");
        } else if (entropy < 50) {
            setPasswordStrength("🟡 Medium: A decent password, but could be stronger.");
        } else {
            setPasswordStrength("🟢 Strong: Great password!");
        }

        if (!value) {
            setErrors((prev) => ({ ...prev, password: "Password is required" }));
        } else if (value.length < 6) {
            setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.password;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) return;

        setIsSubmitting(true);
        try {
            await axios.post("http://localhost:8000/api/signup/employee", {
                username,
                email,
                phonenumber,
                password,
                avatar_url: "https://i.imgur.com/kwWyai6.png",
            });

            toast({
                title: "Success",
                description: "Employee created successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Clear form
            setEmail("");
            setUsername("");
            setPhonenumber("");
            setPassword("");
            setPasswordStrength("");
            setErrors({});

            navigate("/employees");
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to create employee",
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
                <Heading mb={4} textAlign="center">
                    Create Employee
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        {/* Email Field */}
                        <FormControl id="email" isRequired isInvalid={errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isSubmitting}
                            />
                            {errors.email && <Text color="red.500">{errors.email}</Text>}
                        </FormControl>

                        {/* Username Field */}
                        <FormControl id="username" isRequired isInvalid={errors.username}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isSubmitting}
                            />
                            {errors.username && <Text color="red.500">{errors.username}</Text>}
                        </FormControl>

                        {/* Phone Number Field */}
                        <FormControl id="phonenumber" isRequired isInvalid={errors.phonenumber}>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                type="text"
                                value={phonenumber}
                                onChange={handlePhoneChange}
                                disabled={isSubmitting}
                                maxLength="10"
                            />
                            {errors.phonenumber && <Text color="red.500">{errors.phonenumber}</Text>}
                        </FormControl>

                        {/* Password Field */}
                        <FormControl id="password" isRequired isInvalid={errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={isSubmitting}
                            />
                            {errors.password && <Text color="red.500">{errors.password}</Text>}
                            {passwordStrength && !errors.password && (
                                <Text color="green.500" fontSize="sm" mt={1}>
                                    {passwordStrength}
                                </Text>
                            )}
                        </FormControl>

                        {/* Submit Button */}
                        <Button type="submit" colorScheme="teal" width="full" isLoading={isSubmitting}>
                            Create Employee
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default EmployeeCreation;
