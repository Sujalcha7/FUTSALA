import dayjs from "dayjs";
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
    Input,
    Flex,
    Button,
} from "@chakra-ui/react";
import axios from "axios";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const toast = useToast();

    useEffect(() => {
        const controller = new AbortController();

        const fetchUserAndReservations = async () => {
            try {
                // Fetch user information
                const userResponse = await axios.get(
                    "http://localhost:8000/api/current_user/",
                    {
                        signal: controller.signal,
                        withCredentials: true,
                    }
                );

                setIsSuperuser(userResponse.data.role == "owner");

                // Fetch reservations based on user type
                let reservationsResponse;
                if (userResponse.data.role == "owner") {
                    reservationsResponse = await fetchReservationsByDate(
                        selectedDate,
                        controller.signal
                    );
                } else {
                    reservationsResponse = await axios.get(
                        "http://localhost:8000/api/reserves/",
                        {
                            signal: controller.signal,
                            withCredentials: true,
                        }
                    );
                }

                setReservations(reservationsResponse.data);
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

        fetchUserAndReservations();

        return () => {
            controller.abort();
        };
    }, [toast, selectedDate]);

    const fetchReservationsByDate = async (date, signal) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/reserves_by_day/?date_time=${date}`,
                {
                    signal,
                    withCredentials: true,
                }
            );
            return response;
        } catch (error) {
            toast({
                title: "Error Fetching Reservations",
                description:
                    error.response?.data?.detail || "An error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return { data: [] }; // Return an empty response on failure
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const today = new Date();
    const futureReservations = reservations.filter((reservation) => {
        const resDate = new Date(reservation.start_date_time);
        return resDate >= today;
    });
    const pastReservations = reservations.filter((reservation) => {
        const resDate = new Date(reservation.start_date_time);
        return resDate < today;
    });

    return (
        <Container maxW="container.xl" mt={10} mb={10}>
            <Box borderWidth={1} borderRadius="lg" p={6} mb={10}>
                <Heading mb={6}>
                    {isSuperuser
                        ? "All Reservations (by Day)"
                        : "Your Reservations"}
                </Heading>
                {isSuperuser && (
                    <Flex mb={6} align="center" gap={4}>
                        <Input
                            type="date"
                            value={selectedDate}
                            maxW={218}
                            onChange={handleDateChange}
                            max={new Date().toISOString().split("T")[0]} // Prevent selecting future dates
                        />
                        {/* <Button
                            colorScheme="blue"
                            onClick={() =>
                                fetchReservationsByDate(selectedDate)
                            }
                        >
                            Load Reservations
                        </Button> */}
                    </Flex>
                )}
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            {/* <th>Username</th> */}
                            <th>Email</th>
                            <Th>Date</Th>
                            <Th>Start</Th>
                            <Th>End</Th>
                            <Th>Duration (hr)</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {reservations.map((reservation) => (
                            <Tr key={reservation.id}>
                                <Td>{reservation.id}</Td>
                                <Td>{reservation.email}</Td>
                                <Td>
                                    {reservation.start_date_time
                                        ? new Date(
                                              reservation.start_date_time
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "short",
                                              day: "2-digit",
                                          })
                                        : "N/A"}
                                </Td>
                                <Td>
                                    {reservation.start_date_time
                                        ? new Date(
                                              reservation.start_date_time
                                          ).toLocaleTimeString("en-US", {
                                              hour: "numeric",
                                              minute: "2-digit",
                                              hour12: true,
                                          })
                                        : "N/A"}
                                </Td>
                                <Td>
                                    {reservation.end_date_time
                                        ? new Date(
                                              reservation.end_date_time
                                          ).toLocaleTimeString("en-US", {
                                              hour: "numeric",
                                              minute: "2-digit",
                                              hour12: true,
                                          })
                                        : "N/A"}
                                </Td>
                                <Td>
                                    {reservation.end_date_time
                                        ? dayjs(
                                              reservation.end_date_time
                                          ).format("HH") -
                                          dayjs(
                                              reservation.start_date_time
                                          ).format("HH")
                                        : "N/A"}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Container>
    );
};

export default Reservations;
