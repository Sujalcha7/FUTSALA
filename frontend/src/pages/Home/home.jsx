import React from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Stack,
    Icon,
    Input,
    Textarea,
    Button,
    Link,
} from "@chakra-ui/react";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
    FaCalendarAlt,
    FaFutbol,
    FaUserShield,
} from "react-icons/fa"; // Importing relevant icons
import futsalImage from "../../assets/futsalimg.jpg"; // Replace with your own image path

const Home = () => {
    return (
        <Box>
            {/* Hero Section */}
            <Box
                bgImage={`url(${futsalImage})`}
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                minH="70vh"
                position="relative"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: "rgba(0, 0, 0, 0.3)",
                }}
            >
                <Box
                    position="relative"
                    height="60vh"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <VStack spacing={6} color="white" textAlign="center">
                        <Heading as="h1" size="2xl">
                            Explore the FUTSALA
                        </Heading>
                        <Text fontSize="xl">
                            Find your perfect futsal experience
                        </Text>
                        <Button
                            size="lg"
                            colorScheme="red"
                            borderRadius="full"
                            px={8}
                            onClick={() =>
                                console.log("Login options selected")
                            }
                        >
                            Start booking
                        </Button>
                    </VStack>
                </Box>
            </Box>

            {/* Features Section */}
            <Box bg="black" color="white" py={20}>
                <Container maxW="container.xl">
                    <Stack
                        direction={{ base: "column", md: "row" }}
                        spacing={12}
                        justify="space-between"
                    >
                        <Box flex={1} textAlign="center">
                            <Icon
                                as={FaCalendarAlt}
                                boxSize={16}
                                color="red.500"
                                mb={4}
                            />
                            <Heading as="h3" size="lg">
                                Easy Booking
                            </Heading>
                            <Text mt={4}>
                                Seamlessly book your preferred time slots with
                                our easy-to-use calendar.
                            </Text>
                        </Box>

                        <Box flex={1} textAlign="center">
                            <Icon
                                as={FaFutbol}
                                boxSize={16}
                                color="red.500"
                                mb={4}
                            />
                            <Heading as="h3" size="lg">
                                Real-Time Availability
                            </Heading>
                            <Text mt={4}>
                                Check real-time availability of futsal courts
                                and avoid conflicts.
                            </Text>
                        </Box>

                        <Box flex={1} textAlign="center">
                            <Icon
                                as={FaUserShield}
                                boxSize={16}
                                color="red.500"
                                mb={4}
                            />
                            <Heading as="h3" size="lg">
                                Admin Dashboard
                            </Heading>
                            <Text mt={4}>
                                Manage bookings, users, and schedules
                                efficiently from one place.
                            </Text>
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
