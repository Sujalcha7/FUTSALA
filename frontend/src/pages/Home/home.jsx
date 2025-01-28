import React, { useState, useEffect } from "react";
import axios from "axios";
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
    useBreakpointValue,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import futsalImage from "../../assets/futsalimg2.jpg";
import futsalImage1 from "../../assets/futsalimg.jpg";

const DesktopHome = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [courts, setCourts] = useState([]);
    const slides = [
        { image: futsalImage },
        { image: futsalImage1 },
    ];
    const navigate = useNavigate();

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/courts/");
                setCourts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCourts();
    }, []);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [currentSlide]);

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Hero Section */}
            <Box position="relative" h="600px">
                <Image
                    src={slides[currentSlide].image}
                    alt="Hero Image"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                />
                <VStack
                    position="absolute"
                    inset="0"
                    justify="center"
                    align="center"
                    spacing={4}
                    bg="blackAlpha.700"
                    color="white"
                    px={4}
                >
                    <Heading fontSize={{ base: "3xl", md: "5xl" }} textAlign="center">
                        Welcome to FUTSALA
                    </Heading>
                    <Text fontSize={{ base: "lg", md: "xl" }} textAlign="center">
                        Discover your ideal futsal experience with ease.
                    </Text>
                    {/* <Button
                        size="lg"
                        colorScheme="teal"
                        px={8}
                        py={6}
                        fontSize="lg"
                        onClick={() => navigate("/create-reservation")}
                    >
                        Start Booking Now
                    </Button> */}
                </VStack>
                {/* Carousel Controls */}
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

            {/* Available Courts */}
            <Box px={{ base: 4, md: 8, lg: 16 }} py={12}>
                <Heading as="h2" size="xl" textAlign="center" mb={8}>
                    Our Available Courts
                </Heading>
                <Grid
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    }}
                    gap={6}
                >
                    {courts.map((court) => (
                        <GridItem key={court.id}>
                            <Box
                                bgImage={court.images[0]}
                                bgSize="cover"
                                bgPosition="center"
                                h="350px"
                                borderRadius="lg"
                                overflow="hidden"
                                shadow="lg"
                                transition="transform 0.3s ease"
                                _hover={{ transform: "scale(1.05)" }}
                                cursor="pointer"
                                onClick={() => navigate(`/court/${court.id}`)}
                            >
                                <VStack
                                    h="100%"
                                    w="100%"
                                    bg="blackAlpha.600"
                                    justify="center"
                                    align="center"
                                    spacing={2}
                                    color="white"
                                    p={4}
                                >
                                    <Text fontSize="xl" fontWeight="bold" textAlign="center">
                                        {court.court_name}
                                    </Text>
                                    <Text fontSize="md" textAlign="center">
                                        Hourly Rate: ${court.hourly_rate}
                                    </Text>
                                </VStack>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            </Box>

            {/* Features Section */}
            <Container maxW="7xl" py={16}>
                <Grid templateColumns="2fr 1fr" gap={12}>
                    <Box>
                        <Heading size="lg" mb={6}>
                            Why Choose Us?
                        </Heading>
                        <Text fontSize="lg" mb={4}>
                            Our platform is designed to provide the best futsal experience.
                        </Text>
                        <List spacing={4}>
                            {[
                                "Real-time court availability.",
                                "Easy mobile and desktop booking.",
                                "Notifications and reminders.",
                                "Secure and flexible payment options.",
                                "24/7 customer support.",
                            ].map((feature, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={FaCheckCircle} color="teal.500" />
                                    {feature}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Image
                        src={futsalImage1}
                        alt="Features Image"
                        borderRadius="lg"
                        shadow="lg"
                    />
                </Grid>
            </Container>
        </Box>
    );
};

export default DesktopHome;
