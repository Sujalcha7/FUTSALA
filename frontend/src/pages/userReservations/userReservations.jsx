import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    Container,
    Box,
    Heading,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    useToast,
    Button,
    HStack,
    Radio,
    RadioGroup,
} from "@chakra-ui/react";

const UserReservations = () => {
    const location = useLocation();
    const userId = location.state?.userId;
    const toast = useToast();

    const [currentReservations, setCurrentReservations] = useState([]);
    const [pastReservations, setPastReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [selectedReservations, setSelectedReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                const [currentRes, pastRes] = await Promise.all([
                    fetch(
                        `http://localhost:8000/api/users/${userId}/current_reserves/`,
                        {
                            credentials: "include",
                        }
                    ),
                    fetch(
                        `http://localhost:8000/api/users/${userId}/past_reserves/`,
                        {
                            credentials: "include",
                        }
                    ),
                ]);

                if (!currentRes.ok || !pastRes.ok) {
                    throw new Error("Failed to fetch reservations");
                }

                const [currentData, pastData] = await Promise.all([
                    currentRes.json(),
                    pastRes.json(),
                ]);

                setCurrentReservations(currentData);
                setPastReservations(pastData);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchReservations();
    }, [userId, toast]);

    const handleDelete = async () => {
        try {
            if (selectedReservations.length === 0) {
                toast({
                    title: "Error",
                    description: "Please select reservations to delete",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            for (const reservationId of selectedReservations) {
                const response = await fetch(
                    `http://localhost:8000/api/reservations/${reservationId}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(
                        error.detail ||
                            `Failed to delete reservation ${reservationId}`
                    );
                }
            }

            toast({
                title: "Success",
                description: "Selected reservations deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setSelectedReservations([]);
            setShowDeleteOptions(false);
            fetchReservations();
        } catch (error) {
            //     toast({
            //         title: "Error",
            //         description: error.message,
            //         status: "error",
            //         duration: 3000,
            //         isClosable: true,
            //     }
            // );
        }
    };

    const handleSelectReservation = (reservationId) => {
        setSelectedReservations((prev) =>
            prev.includes(reservationId)
                ? prev.filter((id) => id !== reservationId)
                : [...prev, reservationId]
        );
    };

    if (isLoading) {
        return (
            <Container centerContent>
                <Spinner size="xl" />
            </Container>
        );
    }

    const ReservationTable = ({ reservations }) => (
        <Table variant="simple">
            <Thead>
                <Tr>
                    {showDeleteOptions && <Th>Select</Th>}
                    <Th>Court</Th>
                    <Th>Date</Th>
                    <Th>Time</Th>
                    <Th>Status</Th>
                </Tr>
            </Thead>
            <Tbody>
                {reservations.map((reservation) => (
                    <Tr key={reservation.id}>
                        {showDeleteOptions && (
                            <Td>
                                <input
                                    type="checkbox"
                                    checked={selectedReservations.includes(
                                        reservation.id
                                    )}
                                    onChange={() =>
                                        handleSelectReservation(reservation.id)
                                    }
                                />
                            </Td>
                        )}
                        <Td>{reservation.court.court_name}</Td>
                        <Td>
                            {new Date(
                                reservation.start_date_time
                            ).toLocaleDateString()}
                        </Td>
                        <Td>
                            {new Date(
                                reservation.start_date_time
                            ).toLocaleTimeString()}
                        </Td>
                        <Td>{reservation.status}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );

    return (
        <Container maxW="container.xl" py={8}>
            <Box>
                <Heading mb={6}>User Reservations</Heading>
                <HStack spacing={4} mb={4}>
                    <Button
                        colorScheme="red"
                        onClick={() => setShowDeleteOptions(!showDeleteOptions)}
                    >
                        Delete Reservation
                    </Button>
                </HStack>
                <Tabs isFitted variant="enclosed">
                    <TabList mb="1em">
                        <Tab>
                            Current Reservations ({currentReservations.length})
                        </Tab>
                        <Tab>Past Reservations ({pastReservations.length})</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {currentReservations.length > 0 ? (
                                <ReservationTable
                                    reservations={currentReservations}
                                />
                            ) : (
                                <Box textAlign="center">
                                    No current reservations
                                </Box>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {pastReservations.length > 0 ? (
                                <ReservationTable
                                    reservations={pastReservations}
                                />
                            ) : (
                                <Box textAlign="center">
                                    No past reservations
                                </Box>
                            )}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                {showDeleteOptions && (
                    <Box textAlign="right" mt={4}>
                        <Button colorScheme="red" onClick={handleDelete}>
                            Confirm Delete
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default UserReservations;
