import React from "react";
import { Box, Flex, Link as ChakraLink, Spacer } from "@chakra-ui/react";
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
            padding="1.5rem"
            bg="blue.500"
            color="white"
        >
            <Flex align="center" mr={5}>
                <ChakraLink
                    as={RouterLink}
                    to="/"
                    fontWeight="bold"
                    fontSize="lg"
                >
                    Reservation App
                </ChakraLink>
            </Flex>

            <Box>
                {user ? (
                    <>
                        <ChakraLink as={RouterLink} to="/reservations" mr={3}>
                            Reservations
                        </ChakraLink>
                        <ChakraLink
                            as={RouterLink}
                            to="/create-reservation"
                            mr={3}
                        >
                            Create Reservation
                        </ChakraLink>
                        <ChakraLink as={RouterLink} to="/profile">
                            My Profile
                        </ChakraLink>
                    </>
                ) : (
                    <>
                        <ChakraLink as={RouterLink} to="/signup" mr={3}>
                            Signup
                        </ChakraLink>
                        <ChakraLink as={RouterLink} to="/login" mr={3}>
                            Login
                        </ChakraLink>
                    </>
                )}
            </Box>
        </Flex>
    );
}

export default Navbar;
