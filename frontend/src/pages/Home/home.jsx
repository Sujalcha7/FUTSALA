import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    GridItem,
    Heading,
    IconButton,
    Image,
    VStack,
    Stack,
    Icon,
    Input,
    Textarea,
    Button,
    useMediaQuery,
    chakra,
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
} from "react-icons/fa";
import futsalImage from "../../assets/futsalimg2.jpg";

import { useNavigate } from "react-router-dom";
const ChakraImage = chakra("img");

const Home = () => {
    const [isLargerThan600] = useMediaQuery("(min-width: 601px)");
    const [isLargerThan1920] = useMediaQuery("(min-width: 1920px)");
    const navigate = useNavigate();

    const nextSlide = () => {
        setIsSliding(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setIsSliding(false);
        }, 500); // Duration of the sliding effect
    };

    const prevSlide = () => {
        setIsSliding(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            setIsSliding(false);
        }, 500); // Duration of the sliding effect
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [currentSlide]);

    return (
        <Box minH="100vh" display="flex" flexDirection="column" minW="1200px">
            {/* Hero Section */}
            <Box
                id="hero"
                position="relative"
                overflow="hidden"
                zIndex={1}
                padding={{
                    base: "clamp(12.5rem, 25.95vw, 18.75em) 1rem",
                    "120rem": "14vw", // Large desktop - 1920px
                }}
                height={850}
            >
                <Container
                    maxW="80rem"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                    gap="3rem"
                >
                    <VStack
                        spacing={4}
                        align="center"
                        maxW="46.875rem"
                        w="100%"
                        color="white"
                    >
                        {/* <Text as="span" className="cs-topper">
                            Best Gym Of The City For Fitness
                        </Text> */}
                        <Heading
                            fontSize={{
                                base: "clamp(3.0625rem, 6vw, 5.25rem)",
                            }}
                            textAlign="center"
                            mt={280}
                        >
                            Explore The FUTSALA
                        </Heading>
                        <Text mb={8} textAlign="center">
                            Find your perfect futsal experience
                        </Text>
                        <Button
                            size="lg"
                            bg="red.500"
                            color="white"
                            minW="12.5rem"
                            height={{
                                base: "clamp(2.875rem, 5.5vw, 3.5rem)",
                            }}
                            px={6}
                            fontWeight={700}
                            borderRadius="0.25rem"
                            _hover={{
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    bg: "black",
                                    borderRadius: "0.25rem",
                                    transition: "width 0.3s",
                                    zIndex: -1,
                                },
                            }}
                            onClick={() => navigate("/create-reservation")}
                        >
                            Start Booking
                        </Button>
                    </VStack>
                </Container>
                {/* Background Image */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    zIndex={-2}
                >
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        w="100%"
                        h="100%"
                        bg="black"
                        opacity={0.7}
                        zIndex={1}
                        pointerEvents="none"
                    />
                    <ChakraImage
                        src={futsalImage} // Using the imported image
                        alt="field"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        position="absolute"
                        top={0}
                        left={0}
                    />
                </Box>
                {/* Graphic Overlay
                <ChakraImage
                    className="cs-graphic"
                    src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Images/Graphics/white-splatter2.svg"
                    alt="graphic"
                    position="absolute"
                    bottom={0}
                    left="50%"
                    transform="translateX(-50%)"
                    minW="120rem"
                    w="100%"
                    h="20%"
                    objectFit="cover"
                    zIndex={0}
                />
                Dark Mode Graphic - Hidden by default
                <ChakraImage
                    display="none"
                    className="cs-graphic cs-graphic-dark"
                    src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Images/Graphics/dark-mode-splatter2.svg"
                    alt="graphic"
                    position="absolute"
                    bottom={0}
                    left="50%"
                    transform="translateX(-50%)"
                    minW="120rem"
                    w="100%"
                    h="auto"
                    objectFit="cover"
                    zIndex={0}
                /> */}
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
                            <IconButton
                                icon={<FaChevronRight />}
                                position="absolute"
                                right={4}
                                top="50%"
                                transform="translateY(-50%)"
                                onClick={nextSlide}
                                bg="whiteAlpha.800"
                                rounded="full"
                            />
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

export default DesktopHome;
