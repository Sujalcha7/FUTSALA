import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { sendVerificationEmail, auth } from "./../../firebase";
import axios from "axios";

const VerificationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Get the passed email from the signup page
  const { email } = location.state || {};

  const handleSendVerificationEmail = async () => {
    setIsSubmitting(true);

    if (email) {
      try {
        // If we have an email, use Firebase to send the verification email
        const user = auth.currentUser;
        if (user && user.email === email) {
          await sendVerificationEmail(user);
          toast({
            title: "Verification Email Sent",
            description: "Please check your email to verify your account.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "No User Found",
            description: "No matching user found. Please log in to verify your email.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error Sending Email",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Email Missing",
        description: "Unable to find the email to verify. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Reload the user to get the latest verification status
        await user.reload();

        if (user.emailVerified) {
          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          // Notify your backend API about the verification status
          await axios.post("http://localhost:8000/api/verify-email", {
            email: user.email,
          });

          navigate("/");
        } else {
          toast({
            title: "Verification Pending",
            description: "Please verify your email before proceeding.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to verify email. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "No User Found",
        description: "Please log in to verify your email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="600px" py={10}>
      <Box textAlign="center" mb={6}>
        <Heading>Verify Your Email</Heading>
        <Text mt={4} color="gray.600">
          We have sent a verification email to your inbox. Please check your
          email and click the verification link.
        </Text>
      </Box>
      <VStack spacing={4}>
        <Button
          colorScheme="teal"
          onClick={handleSendVerificationEmail}
          isLoading={isSubmitting}
          borderRadius="md"
        >
          Resend Verification Email
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleContinue}
          borderRadius="md"
        >
          I have verified my email
        </Button>
      </VStack>
    </Container>
  );
};

export default VerificationPage;