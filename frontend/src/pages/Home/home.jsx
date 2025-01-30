import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    Grid,
    Heading,
    IconButton,
    Image,
    VStack,
    Text,
    List,
    ListItem,
    ListIcon,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import futsalImage from "../../assets/futsalimg2.jpg";
import futsalImage1 from "../../assets/futsalimg.jpg";
import futsalAction from "../../assets/futsal-action.jpg";
import futsalArena from "../../assets/futsal-arena.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

const DesktopHome = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [{ image: futsalImage }, { image: futsalImage1 }];
    const navigate = useNavigate();

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [currentSlide]);

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Hero Section */}
            <Box position="relative" h="100vh" overflow="hidden">
                <Image src={slides[currentSlide].image} alt="Hero Image" objectFit="cover" w="100%" h="100%" />
                <VStack position="absolute" inset="0" justify="center" align="center" spacing={6} bg="blackAlpha.600" color="white" px={4} textAlign="center">
                    <Heading fontSize={{ base: "3xl", md: "6xl" }} fontWeight="bold" data-aos="fade-down">
                        Welcome to FUTSALA
                    </Heading>
                    <Text fontSize={{ base: "lg", md: "2xl" }} maxW="600px" data-aos="fade-up">
                        Experience the best futsal booking platform with real-time availability and seamless scheduling.
                    </Text>
                    <Button size="lg" colorScheme="teal" px={8} py={6} fontSize="lg" onClick={() => navigate("/courts")} data-aos="zoom-in">
                        Start Booking Now
                    </Button>
                </VStack>
                <IconButton
                    icon={<FaChevronLeft />}
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={prevSlide}
                    bg="blackAlpha.500"
                    color="white"
                    _hover={{ bg: "blackAlpha.700" }}
                    rounded="full"
                />
                <IconButton
                    icon={<FaChevronRight />}
                    position="absolute"
                    right={4}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={nextSlide}
                    bg="blackAlpha.500"
                    color="white"
                    _hover={{ bg: "blackAlpha.700" }}
                    rounded="full"
                />
            </Box>

            {/* System Features Section */}
            <Container maxW="7xl" py={20} textAlign="center">
                <Heading size="xl" mb={12} data-aos="fade-up">
                    Why Choose FUTSALA?
                </Heading>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={10}>
                    {[
                        { image: futsalAction, text: "Real-time Court Availability" },
                        { image: futsalArena, text: "Secure Online Booking" },
                        { image: futsalImage1, text: "Automated Notifications" },
                    ].map((feature, index) => (
                        <VStack key={index} spacing={4} data-aos="fade-up">
                            <Image src={feature.image} alt="Feature Image" borderRadius="lg" boxShadow="lg" w="100%" h="250px" objectFit="cover" />
                            <Heading size="md">{feature.text}</Heading>
                        </VStack>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default DesktopHome;
