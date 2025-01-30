import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import signupImage from "../../assets/signup.png";
import { useAuth } from "../../AuthContext";

// Password Strength Checker
const calculatePasswordEntropy = (password) => {
  const characterSets = [
    /[a-z]/,
    /[A-Z]/,
    /[0-9]/,
    /[!@#$%^&*(),.?":{}|<>]/,
  ];
  let poolSize = 0;
  characterSets.forEach((regex) => {
    if (regex.test(password)) {
      poolSize += regex.source.length;
    }
  });
  return password.length * Math.log2(poolSize || 1);
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuth();

  // Handle password validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const entropy = calculatePasswordEntropy(value);
    if (entropy < 28) setPasswordError("Very Weak: Use a stronger password.");
    else if (entropy < 36) setPasswordError("Weak: Add more complexity.");
    else if (entropy < 50) setPasswordError("Medium: Could be stronger.");
    else setPasswordError("");
  };

  // Handle phone number validation
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhonenumber(value);
      setPhoneError(value.length === 10 ? "" : "Phone number must be 10 digits.");
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await axios.post("http://localhost:8000/api/signup/", {
        username: result.user.displayName,
        email: result.user.email,
        phonenumber: "9888888888",
        password: "pseudo-password",
        avatar_url: "https://i.imgur.com/kwWyai6.png",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Google Signup Failed",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || phoneError) {
      toast({
        title: "Invalid Input",
        description: "Fix errors before submitting.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/api/signup/", {
        username,
        email,
        phonenumber,
        password,
        avatar_url: "https://i.imgur.com/kwWyai6.png",
      });

      toast({
        title: "Signup Successful",
        description: "Your account has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.response?.data?.detail || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="1000px" py={10}>
      <Stack
        direction={["column", "row"]}
        spacing={8}
        align="center"
        justify="center"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
      >
        {/* Illustration */}
        <Box flex={1} textAlign="center">
          <img src={signupImage} alt="Signup Illustration" style={{ maxWidth: "100%", height: "auto" }} />
        </Box>

        {/* Form Section */}
        <Box flex={1} maxW="400px" mr={8}>
          <Heading mb={4} textAlign="center" color="gray.700">
            Create Your Account
          </Heading>
          <Text textAlign="center" color="gray.500" mb={6}>
            Join <Text as="span" fontWeight="bold">Futsala</Text> and simplify your workflow.
          </Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isSubmitting} />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
              </FormControl>

              <FormControl id="phonenumber" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input type="text" value={phonenumber} onChange={handlePhoneChange} disabled={isSubmitting} />
                {phoneError && <Text mt={2} fontSize="sm" color="red.500">{phoneError}</Text>}
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={handlePasswordChange} disabled={isSubmitting} />
                {passwordError && <Text mt={2} fontSize="sm" color="red.500">{passwordError}</Text>}
              </FormControl>

              <Button type="submit" colorScheme="teal" width="full" isLoading={isSubmitting} isDisabled={passwordError || phoneError}>
                Sign Up
              </Button>
            </VStack>
          </form>

          <Divider my={6} />
          <Text textAlign="center" color="gray.500" mb={4}>or continue with</Text>
          <HStack justify="center" spacing={4} mb={6}>
            <IconButton icon={<FaGoogle />} aria-label="Login with Google" variant="outline" onClick={handleGoogleSignIn} />
          </HStack>

          <HStack justify="center">
            <Text>Already have an account?</Text>
            <Button variant="link" colorScheme="blue" onClick={() => navigate("/login")}>Log In</Button>
          </HStack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Signup;
