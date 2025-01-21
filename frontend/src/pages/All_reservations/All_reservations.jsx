import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Spinner,
    Center,
    Text,
    VStack,
    Container,
    Box,
    Heading,
} from "@chakra-ui/react";
import Reservations from "../../components/Reservations/reservation";

const ReservationsPage = () => {
    const [allReservations, setAllReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/all-reserves/",
                    {
                        withCredentials: true,
                    }
                );
                setAllReservations(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) {
        return (
            <Center h="100vh">
                <VStack spacing={4}>
                    <Text color="red.500">
                        Error loading reservations: {error}
                    </Text>
                    <Text>Please try again later</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Container maxW="container.xl">
            <Box py={6}>
                <Heading mb={6} size="lg" textAlign="center">
                    All Reservations
                </Heading>
            </Box>
            <Reservations reservations={allReservations} />
        </Container>
    );
};

export default ReservationsPage;
