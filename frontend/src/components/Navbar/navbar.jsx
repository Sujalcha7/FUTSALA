import React from "react";
import { useToast, Button, Box, Flex, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Navbar() {
  const { user , setUser } = useAuth();
  const toast = useToast();
    const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description:
          error.response?.data?.detail || "An error occurred during logout",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="white.800"
      color="black"
    >
      {/* Brand Logo */}
      <Flex align="center" mr={5}>
        <ChakraLink as={RouterLink} to="/" fontWeight="bold" fontSize="lg">
          FUTSALA
        </ChakraLink>
      </Flex>

      {/* Navigation Links */}
      <Flex align="center">
        {user ? (
          user.role == "manager" ? (
            // Links for superuser
            <Flex align="center" gap={3}>
              <ChakraLink as={RouterLink} to="/dashboard">
                Dashboard
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/employees">
                Employees
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/reservations">
                Reservations
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/user-list">
                User list
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/profile" mr={3}>
                <Text fontSize="md" fontWeight="medium">
                  Welcome, {user.email}!
                </Text>
              </ChakraLink>
              <Button colorScheme="red" onClick={handleLogout} mt={4}>
                Logout
              </Button>
            </Flex>
          ) : (
            // Links for normal users
            <>
              <ChakraLink as={RouterLink} to="/create-reservation" mr={3}>
                Create Reservation
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/aboutus" mr={3}>
                About Us
              </ChakraLink>
              <ChakraLink as={RouterLink} to="/profile" mr={3}>
                <Text fontSize="md" fontWeight="medium" ml={3}>
                  Welcome, {user.email}!
                </Text>
              </ChakraLink>
            </>
          )
        ) : (
          // Links for unauthenticated users
          <>
            <ChakraLink as={RouterLink} to="/signup" mr={3}>
              Signup
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/login" mr={3}>
              Login
            </ChakraLink>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default Navbar;
