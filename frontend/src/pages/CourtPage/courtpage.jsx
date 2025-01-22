import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    Stack,
    Badge,
    Flex,
    VStack,
    HStack,
    Image,
    IconButton,
    useToast,
    AspectRatio,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import axios from "axios";

const CourtPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [court, setCourt] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchCourt = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/courts/${id}`,
                    {
                        withCredentials: true,
                    }
                );
                setCourt(response.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch court details",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        fetchCourt();
    }, [id]);

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === court.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? court.images.length - 1 : prev - 1
        );
    };

    if (!court) return <Box>Loading...</Box>;

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                {/* Image Carousel */}
                <Box position="relative" overflow="hidden" borderRadius="lg">
                    <Flex
                        justify="center"
                        align="center"
                        w="100%"
                        bg="gray.100"
                    >
                        <AspectRatio
                            ratio={16 / 9}
                            w={{ base: "100%", md: "80%" }}
                            maxW="1200px"
                        >
                            <Image
                                src={court.images[currentImageIndex]}
                                alt={`Court image ${currentImageIndex + 1}`}
                                w="100%"
                                h="100%"
                                objectFit="cover"
                                objectPosition="center"
                            />
                        </AspectRatio>
                    </Flex>
                    <IconButton
                        icon={<ChevronLeftIcon />}
                        position="absolute"
                        left={2}
                        top="50%"
                        transform="translateY(-50%)"
                        onClick={prevImage}
                        bg="blackAlpha.700"
                        color="white"
                        _hover={{ bg: "blackAlpha.900" }}
                    />
                    <IconButton
                        icon={<ChevronRightIcon />}
                        position="absolute"
                        right={2}
                        top="50%"
                        transform="translateY(-50%)"
                        onClick={nextImage}
                        bg="blackAlpha.700"
                        color="white"
                        _hover={{ bg: "blackAlpha.900" }}
                    />
                    <HStack
                        position="absolute"
                        bottom={4}
                        left="50%"
                        transform="translateX(-50%)"
                        spacing={2}
                    >
                        {court.images.map((_, index) => (
                            <Box
                                key={index}
                                w={2}
                                h={2}
                                borderRadius="full"
                                bg={
                                    index === currentImageIndex
                                        ? "white"
                                        : "whiteAlpha.600"
                                }
                                cursor="pointer"
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </HStack>
                </Box>

                {/* Court Details */}
                <Stack spacing={4}>
                    <Heading size="xl">{court.court_name}</Heading>
                    <HStack>
                        <Badge colorScheme="green">{court.court_type}</Badge>
                        <Badge
                            colorScheme={court.is_available ? "green" : "red"}
                        >
                            {court.is_available ? "Available" : "Not Available"}
                        </Badge>
                    </HStack>
                    <Text fontSize="lg">{court.description}</Text>
                    <HStack>
                        <Text fontWeight="bold">Capacity:</Text>
                        <Text>{court.capacity} People</Text>
                    </HStack>
                    <HStack>
                        <Text fontWeight="bold">Rate:</Text>
                        <Text>Rs {court.hourly_rate}/hour</Text>
                    </HStack>

                    {/* Reservation Button */}
                    <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={() => navigate(`/create-reservation/${id}`)}
                        isDisabled={!court.is_available}
                    >
                        Make Reservation
                    </Button>
                </Stack>
            </VStack>
        </Container>
    );
};

export default CourtPage;
