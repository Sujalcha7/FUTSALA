import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { auth, provider, signInWithPopup } from "../../firebase";
import { useAuth } from "../../AuthContext";
import signupImage from "../../assets/signup.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuth();

  // Ensure axios always sends credentials
  axios.defaults.withCredentials = true;

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        setUser(result.user);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Google Sign-In Failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const controller = new AbortController();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        { email, password },
        { signal: controller.signal, withCredentials: true }
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

        if (response.data.user.role === "owner") {
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

        toast({
          title: "Login Failed",
          description: formattedErrorMessage,
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

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
        {/* Illustration Section */}
        <Box flex={1} textAlign="center">
          <img
            src={signupImage}
            alt="Login Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>

        {/* Form Section */}
        <Box flex={1} maxW="400px" mr={8}>
          <Heading mb={4} textAlign="center" color="gray.700">
            Welcome Back
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

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  borderRadius="md"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={isSubmitting}
                borderRadius="md"
              >
                Log In
              </Button>

              <Button
                variant="link"
                colorScheme="blue"
                onClick={handleForgotPassword}
                width="full"
              >
                Forgot Password?
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
          </HStack>

          <HStack justify="center">
            <Text>Don't have an account?</Text>
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </HStack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Login;
