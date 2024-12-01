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
    // console.log(format(new date(), "yyyy/DD/MM"));
    // console.log("hello")
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
            description: error.response?.data?.detail || "An error occurred",
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
    <Container maxW="container.xl" mt={10} mb={10}>
      <Box borderWidth={1} borderRadius="lg" p={6}>
        <Heading mb={6}>Reservations</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Start</Th>
              <Th>End</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reservations.map((reservation) => (
              <Tr key={reservation.id}>
                <Td>{reservation.id}</Td>
                <Td>
                  {reservation.date_time
                    ? new Date(reservation.start_date_time).toLocaleString()
                    : "N/A"}
                </Td>
                <Td>
                  {reservation.end_date_time
                    ? new Date(reservation.end_date_time).toLocaleString()
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
