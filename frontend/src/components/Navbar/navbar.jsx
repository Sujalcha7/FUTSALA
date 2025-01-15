import React from "react";
import { Box, Flex, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../AuthContext";

function Navbar() {
    const { user } = useAuth();

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1rem"
            bg="black"
            color="white"
        >
            {/* Brand Logo */}
            <Flex align="center" mr={5}>
                <ChakraLink
                    as={RouterLink}
                    to="/"
                    fontWeight="bold"
                    fontSize="lg"
                >
                    FUTSALA
                </ChakraLink>
            </Flex>

            {/* Navigation Links */}
            <Flex align="center">
                {user ? (
                    user.role == "owner" ? (
                        // Links for superuser
                        <Flex align="center" gap={3}>
                            <ChakraLink
                                as={RouterLink}
                                to="/superuser-dashboard"
                            >
                                Superuser Dashboard
                            </ChakraLink>
                            <ChakraLink as={RouterLink} to="/reservations">
                                Reservations
                            </ChakraLink>
                            <ChakraLink as={RouterLink} to="/profile" mr={3}>
                                <Text fontSize="md" fontWeight="medium">
                                    Welcome, {user.email}!
                                </Text>
                            </ChakraLink>
                        </Flex>
                    ) : (
                        // Links for normal users
                        <>
                            <ChakraLink
                                as={RouterLink}
                                to="/create-reservation"
                                mr={3}
                            >
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
