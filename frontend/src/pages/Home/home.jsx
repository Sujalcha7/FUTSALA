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
    Text,
    List,
    ListItem,
    ListIcon,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import futsalImage from "../../assets/futsalimg2.jpg";
import futsalImage1 from "../../assets/futsalimg.jpg";

const DesktopHome = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const slides = [
        {
            image: futsalImage,
        },
        {
            image: futsalImage1,
        },
    ]; // Use the provided image for all slides
    const navigate = useNavigate();

    const nextSlide = () => {
        setIsSliding(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setIsSliding(false);
        }, 300); // Reduced timing for smoother transition
    };

    const prevSlide = () => {
        setIsSliding(true);
        setTimeout(() => {
            setCurrentSlide(
                (prev) => (prev - 1 + slides.length) % slides.length
            );
            setIsSliding(false);
        }, 300);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [currentSlide]);

    return (
        <Box minH="100vh" display="flex" flexDirection="column" minW="1200px">
            {/* Hero Section */}
            <Box position="relative" h="800px">
                <Image
                    src={futsalImage}
                    alt="Hero Image"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                />
                <VStack
                    position="absolute"
                    inset="0"
                    justify="center"
                    spacing={8}
                    color="white"
                    bg="blackAlpha.600"
                >
                    <Heading
                        fontSize={{
                            base: "clamp(2.5625rem, 5vw, 4.25rem)",
                        }}
                        textAlign="center"
                        // mt={280}
                    >
                        Explore the FUTSALA
                    </Heading>
                    <Text mb={0} textAlign="center">
                        Find your perfect futsal experience
                    </Text>
                    <Button
                        size="lg"
                        colorScheme="red"
                        variant="solid"
                        px={12}
                        py={7}
                        fontSize="xl"
                        onClick={() => navigate("/create-reservation")}
                    >
                        Start Booking
                    </Button>
                </VStack>
            </Box>

            {/* Main Content */}
            <Container maxW="1400px" my={12}>
                <Grid templateColumns="3fr 1fr" gap={12}>
                    {/* Left Column */}
                    <GridItem>
                        {/* Carousel */}
                        <Box
                            position="relative"
                            h="400px"
                            mb={12}
                            borderRadius="lg"
                            overflow="hidden"
                        >
                            <Box
                                className={isSliding ? "sliding" : ""}
                                transition="transform 0.3s ease-in-out"
                                transform={`translateX(-${
                                    currentSlide * 100
                                }%)`}
                                display="flex"
                                w={`${slides.length * 100}%`}
                                h="100%"
                            >
                                {slides.map((slide, index) => (
                                    <Box
                                        key={index}
                                        flexShrink={0}
                                        w="100%"
                                        h="100%"
                                    >
                                        <Image
                                            src={slide.image}
                                            alt={`Slide ${index}`}
                                            objectFit="cover"
                                            w="100%"
                                            h="100%"
                                        />
                                    </Box>
                                ))}
                            </Box>
                            <IconButton
                                icon={<FaChevronLeft />}
                                position="absolute"
                                left={4}
                                top="50%"
                                transform="translateY(-50%)"
                                onClick={prevSlide}
                                bg="whiteAlpha.800"
                                rounded="full"
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
                        {/* Content */}
                        <Heading size="xl" mb={4}>
                            Welcome to Our Platform
                        </Heading>
                        <Text fontSize="lg" mb={6}>
                            Explore a world of possibilities with our
                            comprehensive platform. Designed to meet your needs,
                            we ensure a seamless experience.
                        </Text>

                        {/* Cards */}
                        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            {["Innovation", "Excellence", "Growth"].map(
                                (title, i) => (
                                    <Box
                                        key={i}
                                        p={6}
                                        bg="white"
                                        shadow="md"
                                        rounded="lg"
                                        transition="0.3s"
                                        _hover={{
                                            transform: "translateY(-5px)",
                                        }}
                                    >
                                        <Heading size="md" mb={4}>
                                            {title}
                                        </Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            Achieve {title.toLowerCase()} with
                                            our advanced features and support.
                                        </Text>
                                    </Box>
                                )
                            )}
                        </Grid>
                    </GridItem>

                    {/* Right Column */}
                    <GridItem>
                        <Heading size="lg" mb={6}>
                            Our Features
                        </Heading>
                        <List spacing={4}>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Real-time booking system for convenience.
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Easy-to-use mobile and desktop interfaces.
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Notifications for reservations and updates.
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Secure payment system with multiple options.
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Customer support for all queries.
                            </ListItem>
                        </List>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
};

export default DesktopHome;
