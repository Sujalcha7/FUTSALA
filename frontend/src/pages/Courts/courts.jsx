import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Heading,
  Text,
  Box,
  Grid,
  GridItem,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchCourts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/courts/");
        setCourts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourts();
  }, []);

  return (
    <>
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
      {/* <Container maxW="container.xl" mt={4} mb={4}>
        <Heading mb={4} size="lg" textAlign="center">
          Available Courts
        </Heading>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Court Name</Th>
                <Th>Address</Th>
                <Th>City</Th>
                <Th>State</Th>
                <Th>Zip</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courts.map((court) => (
                <Tr key={court.id}>
                  <Td>{court.name}</Td>
                  <Td>{court.address}</Td>
                  <Td>{court.city}</Td>
                  <Td>{court.state}</Td>
                  <Td>{court.zip}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Container> */}
    </>
  );
};

export default Courts;
