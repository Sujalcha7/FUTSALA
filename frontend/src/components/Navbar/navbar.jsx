import React from "react";
import { Box, Flex, Link as ChakraLink, Spacer } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function Navbar() {
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
                <ChakraLink as={RouterLink} to="/signup" mr={3}>
                    Signup
                </ChakraLink>
                <ChakraLink as={RouterLink} to="/login" mr={3}>
                    Login
                </ChakraLink>
                <ChakraLink as={RouterLink} to="/reservations" mr={3}>
                    Reservations
                </ChakraLink>
                <ChakraLink as={RouterLink} to="/aboutus" mr={3}>
                    About Us
                </ChakraLink>
                <ChakraLink as={RouterLink} to="/create-reservation">
                    Create Reservation
                </ChakraLink>
            </Box>
        </Flex>
    );
}

export default Navbar;
