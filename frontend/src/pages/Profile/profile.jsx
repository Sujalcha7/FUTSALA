import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Reservations from "../../components/Reservations/reservation";
import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    Button,
    Badge,
    Card,
    CardHeader,
    CardBody,
    Container,
    Avatar,
    Input,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import axios from "axios";

const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [profilePic, setProfilePic] = useState(null);
    const [currentReservations, setCurrentReservations] = useState([]);
    const [pastReservations, setPastReservations] = useState([]);
    const [allReservations, setAllReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchReservations();
        }
    }, [user, navigate]);

    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            if (user.role === "customer") {
                // Fetch current reservations
                const currentResponse = await axios.get(
                    "http://localhost:8000/api/current_reserves/",
                    { withCredentials: true }
                );
                setCurrentReservations(currentResponse.data);

                // Fetch past reservations
                const pastResponse = await axios.get(
                    "http://localhost:8000/api/past_reserves/",
                    { withCredentials: true }
                );
                setPastReservations(pastResponse.data);
            } else if (user.role === "manager") {
                // Use new endpoint for managers
                const response = await axios.get(
                    "http://localhost:8000/api/all-reserves/",
                    { withCredentials: true }
                );
                setAllReservations(response.data);
            }
        } catch (error) {
            toast({
                title: "Error fetching reservations",
                description:
                    error.response?.data?.detail ||
                    "An error occurred while fetching your reservations",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8000/api/logout/",
                {},
                { withCredentials: true }
            );
            setUser(null);
            navigate("/login");
        } catch (error) {
            toast({
                title: "Logout failed",
                description:
                    error.response?.data?.detail ||
                    "An error occurred during logout",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5000000) {
                // 5MB limit
                toast({
                    title: "File too large",
                    description: "Please select an image under 5MB",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => setProfilePic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Container maxW="1500" py={8}>
            <Heading mb={6} textAlign="center">
                My Profile
            </Heading>

            <Box bg="gray.50" p={6} borderRadius="lg" shadow="md">
                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                    {/* Profile Information Card */}
                    <Card
                        flex="1"
                        minW={{ base: "100%", md: "300px" }}
                        minH={{ base: "100%", md: "600px" }}
                    >
                        <CardBody>
                            <VStack align="stretch" spacing={4}>
                                <Box textAlign="center">
                                    <Avatar
                                        size="xl"
                                        src={profilePic}
                                        mb={4}
                                        name={user.email} // Fallback to show initials
                                    />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                        mt={2}
                                        size="sm"
                                    />
                                </Box>
                                <Text fontSize="lg" fontWeight="bold">
                                    Email:
                                </Text>
                                <Text>{user.email}</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                    Account Type:
                                </Text>
                                <Badge
                                    colorScheme={
                                        user.role === "owner"
                                            ? "green"
                                            : user.role === "employee"
                                            ? "purple"
                                            : "blue"
                                    }
                                    width="fit-content"
                                >
                                    {user.role}
                                </Badge>
                                <Button
                                    colorScheme="red"
                                    onClick={handleLogout}
                                    mt={4}
                                >
                                    Logout
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Reservations Card */}
                    <Card flex="3">
                        <CardBody>
                            {isLoading ? (
                                <Flex justify="center" align="center" h="200px">
                                    <Spinner size="xl" />
                                </Flex>
                            ) : user.role === "customer" ? (
                                <>
                                    <Heading size="md" mb={4}>
                                        Current Reservations
                                    </Heading>
                                    {currentReservations.length > 0 ? (
                                        <Reservations
                                            reservations={currentReservations}
                                        />
                                    ) : (
                                        <Text color="gray.500">
                                            No current reservations
                                        </Text>
                                    )}

                                    <Heading size="md" mt={6} mb={4}>
                                        Reservation History
                                    </Heading>
                                    {pastReservations.length > 0 ? (
                                        <Reservations
                                            reservations={pastReservations}
                                        />
                                    ) : (
                                        <Text color="gray.500">
                                            No past reservations
                                        </Text>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Heading size="md" mb={4}>
                                        All Reservations
                                    </Heading>
                                    {allReservations.length > 0 ? (
                                        <Reservations
                                            reservations={allReservations}
                                        />
                                    ) : (
                                        <Text color="gray.500">
                                            No reservations found
                                        </Text>
                                    )}
                                    <Text color="gray.500">{user.role}</Text>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </Flex>
            </Box>
        </Container>
    );
};

export default Profile;
