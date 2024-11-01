import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Button,
    Stack,
    Link as ChakraLink,
} from "@chakra-ui/react";

const Home = () => {
    return (
        <Container maxW="container.xl" mt={10}>
            <Box textAlign="center" p={10}>
                <VStack spacing={6}>
                    <Heading as="h1" size="2xl" mb={4}>
                        Welcome to Reservation App
                    </Heading>
                    <Text fontSize="xl" mb={6}>
                        Easily manage your reservations with our simple and
                        intuitive platform.
                    </Text>
                    <Stack spacing={4} direction="row" justify="center">
                        <Button
                            as={ReactRouterLink}
                            to="/signup"
                            colorScheme="blue"
                            size="lg"
                        >
                            Sign Up
                        </Button>
                        <Button
                            as={ReactRouterLink}
                            to="/login"
                            colorScheme="green"
                            size="lg"
                        >
                            Log In
                        </Button>
                    </Stack>
                </VStack>
            </Box>
        </Container>
    );
};

export default Home;
