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
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";

import axios from "axios";
import signupImage from "../../assets/signup.png";
import { useAuth } from "../../AuthContext";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuth();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const entropy = calculatePasswordEntropy(value);
    if (entropy < 28) {
      setPasswordError("Very Weak: Consider using a stronger password.");
    } else if (entropy < 36) {
      setPasswordError("Weak: Add more complexity or length.");
    } else if (entropy < 50) {
      setPasswordError("Medium: A decent password, but could be stronger.");
    } else {
      setPasswordError(""); // Strong password
    }
  };
  const handleGoogleSignIn = async (e) => {
    const result = await signInWithPopup(auth, provider);
    e.preventDefault();
    setIsSubmitting(true);
    const controller = new AbortController();
    try {
      await axios.post(
        "http://localhost:8000/api/signup/",
        {
          username: result.user.displayName,
          email: result.user.email,
          phonenumber: "9888888888",
          password: "pseudo-password",
          avatar_url: "https://i.imgur.com/kwWyai6.png",
        },
        {
          signal: controller.signal,
        }
      );
      setUsername("");
      setEmail("");
      setPassword("");
      setPhonenumber("");
    //   navigate("/login");
    } catch (error) {
    //   if (!axios.isCancel(error)) {
    //     toast({
    //       title: "Signup Failed",
    //       description: error.response?.data?.detail || "An error occurred",
    //       status: "error",
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //   }
    } finally {
      setIsSubmitting(false);
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        { email:result.user.email, password:"pseudo-password" },
        { signal: controller.signal, withCredentials: true }
      );

      if (response.data && response.data.user) {
        setUser(response.data.user);
        // toast({
        //   title: "Login Successful",
        //   description: "You have successfully logged in.",
        //   status: "success",
        //   duration: 3000,
        //   isClosable: true,
        // });

        if (response.data.user.role === "manager") {
          navigate("/superuser-dashboard");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        const errorMessage =
          error.response?.data?.detail || "An error occurred";
        const formattedErrorMessage = Array.isArray(errorMessage)
          ? errorMessage
              .map((err) => `${err.msg} (${err.loc.join(" -> ")})`)
              .join(", ")
          : errorMessage;
      }
    } finally {
      setIsSubmitting(false);
    }
    return () => controller.abort();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) {
      toast({
        title: "Invalid Password",
        description: "Please use a stronger password before submitting.",
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
        "http://localhost:8000/api/signup/",
        {
          username,
          email,
          phonenumber,
          password,
          avatar_url: "https://i.imgur.com/kwWyai6.png",
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
      setUsername("");
      setEmail("");
      setPassword("");
      setPhonenumber("");
      navigate("/login");
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast({
          title: "Signup Failed",
          description: error.response?.data?.detail || "An error occurred",
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
    <Container maxW="1000px" py={10}>
      <Stack
        direction={["column", "row"]}
        spacing={8}
        align="center"
        justify="center"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        // p={6 }
        // backgroundColor="#eaeaea"
      >
        {/* Illustration Section */}
        <Box flex={1} textAlign="center">
          <img
            src={signupImage} // Update the path to your image
            alt="Signup Illustration"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
          {/* <Text mt={4} fontSize="lg" color="gray.600">
                        Join us and manage your account with ease.
                    </Text> */}
        </Box>

        {/* Form Section */}
        <Box flex={1} maxW="400px" mr={8}>
          <Heading mb={4} textAlign="center" color="gray.700">
            Create Your Account
          </Heading>
          <Text textAlign="center" color="gray.500" mb={6}>
            Simplify your workflow with{" "}
            <Text as="span" fontWeight="bold">
              Futsala
            </Text>
            . Get started for free.
          </Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  borderRadius="md"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  borderRadius="md"
                />
              </FormControl>

              <FormControl id="phonenumber" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="text"
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                  disabled={isSubmitting}
                  borderRadius="md"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                  borderRadius="md"
                />
                {passwordError && (
                  <Text mt={2} fontSize="sm" color="red.500">
                    {passwordError}
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={isSubmitting}
                borderRadius="md"
              >
                Sign Up
              </Button>
            </VStack>
          </form>
          <Divider my={6} />
          <Text textAlign="center" color="gray.500" mb={4}>
            or continue with
          </Text>
          <HStack justify="center" spacing={4} mb={6}>
            <IconButton
              icon={<FaGoogle />}
              aria-label="Login with Google"
              variant="outline"
              onClick={handleGoogleSignIn}
            />
            {/* <IconButton
                            icon={<FaApple />}
                            aria-label="Login with Apple"
                            variant="outline"
                        />
                        <IconButton
                            icon={<FaFacebook />}
                            aria-label="Login with Facebook"
                            variant="outline"
                        /> */}
          </HStack>

          <HStack justify="center">
            <Text>Already have an account?</Text>
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </HStack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Signup;
