import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    Heading,
} from "@chakra-ui/react";
import axios from "axios";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const toast = useToast();

    useEffect(() => {
        const controller = new AbortController();

        const fetchReservations = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/reserves/",
                    {
                        signal: controller.signal,
                        withCredentials: true,
                    }
                );
                setReservations(response.data);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    toast({
                        title: "Error Fetching Reservations",
                        description:
                            error.response?.data?.detail || "An error occurred",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
        };

        fetchReservations();

        return () => {
            controller.abort();
        };
    }, [toast]);

    return (
        <Container maxW="container.xl" mt={10} mb={600}>
            <Box borderWidth={1} borderRadius="lg" p={6}>
                <Heading mb={6}>Reservations</Heading>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Date and Time</Th>
                            <Th>Duration (hr)</Th>
                            <Th>Reservor ID</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {reservations.map((reservation) => (
                            <Tr key={reservation.id}>
                                <Td>{reservation.id}</Td>
                                <Td>
                                    {reservation.date_time
                                        ? new Date(
                                              reservation.date_time
                                          ).toLocaleString()
                                        : "N/A"}
                                </Td>
                                <Td>{reservation.duration || "N/A"}</Td>
                                <Td>{reservation.reservor_id || "N/A"}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Container>
    );
};

export default Reservations;
