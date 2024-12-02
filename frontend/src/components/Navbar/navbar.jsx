import React from "react";
import { Box, Flex, Link as ChakraLink, Image, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import logo from "./../../assets/IMG_2967.png";

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
                <ChakraLink as={RouterLink} to="/">
                    <Image
                        src={logo}
                        alt="FUTSALA Logo"
                        height="40px"
                        width={160}
                    />
                </ChakraLink>
            </Flex>

            {/* Navigation Links */}
            <Flex align="center">
                {user ? (
                    user.is_superuser ? (
                        // Links for superuser
                        <Flex align="center" gap={3}>
                            <ChakraLink
                                as={RouterLink}
                                to="/superuser-dashboard"
                            >
                                Superuser Dashboard
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
