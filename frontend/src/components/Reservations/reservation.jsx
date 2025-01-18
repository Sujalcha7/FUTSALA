import dayjs from "dayjs";
import React from "react";
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
} from "@chakra-ui/react";

const Reservations = ({ reservations }) => {
    const toast = useToast();

    // Format the date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    // Format the time for display
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Calculate duration
    const calculateDuration = (start, end) => {
        if (!start || !end) return "N/A";
        return dayjs(end).format("HH") - dayjs(start).format("HH");
    };

    return (
        <Container maxW="container.xl" mt={4} mb={4}>
            <Box borderWidth={1} borderRadius="lg" p={6}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Reservation ID</Th>
                            <Th>Date</Th>
                            <Th>Start</Th>
                            <Th>End</Th>
                            <Th>Duration (hr)</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {reservations &&
                            reservations.map((reservation) => (
                                <Tr key={reservation.id}>
                                    <Td>{reservation.id}</Td>
                                    <Td>
                                        {reservation.start_date_time
                                            ? formatDate(
                                                  reservation.start_date_time
                                              )
                                            : "N/A"}
                                    </Td>
                                    <Td>
                                        {reservation.start_date_time
                                            ? formatTime(
                                                  reservation.start_date_time
                                              )
                                            : "N/A"}
                                    </Td>
                                    <Td>
                                        {reservation.end_date_time
                                            ? formatTime(
                                                  reservation.end_date_time
                                              )
                                            : "N/A"}
                                    </Td>
                                    <Td>
                                        {calculateDuration(
                                            reservation.start_date_time,
                                            reservation.end_date_time
                                        )}
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
