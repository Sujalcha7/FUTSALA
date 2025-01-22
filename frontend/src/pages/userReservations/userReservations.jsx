import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const userId = location.state.userId;

useEffect(() => {
  axios
    .get(`http://127.0.0.1:8000/api/reservations/${userId}`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log(userId);
      console.log(response.data);
      setReservations(response.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setIsLoading(false);
    });
}, [userId]);

  return (
    <Container maxW="container.xl" mt={4} mb={4}>
      <Box borderWidth={1} borderRadius="lg" p={6}>
        <Heading mb={4} size="lg" textAlign="center">
          User Reservations
        </Heading>
        {isLoading ? (
          <Spinner size="xl" />
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Start Date Time</Th>
                <Th>End Date Time</Th>
                <Th>Rate</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reservations.map((reservation) => (
                <Tr key={reservation.id}>
                  <Td>{reservation.id}</Td>
                  <Td>{reservation.start_date_time}</Td>
                  <Td>{reservation.end_date_time}</Td>
                  <Td>{reservation.rate}</Td>
                  <Td>{reservation.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {reservations.length === 0 && !isLoading && (
          <Text mt={4} textAlign="center">
            No reservations found.
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default UserReservations;