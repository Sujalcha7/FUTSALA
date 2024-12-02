import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Stack,
  Icon,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaCalendarAlt,
  FaFutbol,
  FaUserShield,
} from "react-icons/fa";
import futsalImage from "../../assets/futsalimg.jpg";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgImage={`url(${futsalImage})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        minH="70vh"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          position="relative"
          height="60vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={6} color="white" textAlign="center">
            <Heading as="h1" size="2xl">
              Explore the FUTSALA
            </Heading>
            <Text fontSize="xl">Find your perfect futsal experience</Text>
            <Button
              size="lg"
              colorScheme="red"
              borderRadius="full"
              px={8}
              onClick={() => navigate("/create-reservation")}
            >
              Start booking
            </Button>
          </VStack>
        </Box>
      </Box>

      {/* Features Section */}
      <Box bg="black" color="white" py={20}>
        <Container maxW="container.xl">
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={12}
            justify="space-between"
          >
            <Box flex={1} textAlign="center">
              <Icon as={FaCalendarAlt} boxSize={16} color="red.500" mb={4} />
              <Heading as="h3" size="lg">
                Easy Booking
              </Heading>
              <Text mt={4}>
                Seamlessly book your preferred time slots with our easy-to-use
                calendar.
              </Text>
            </Box>

            <Box flex={1} textAlign="center">
              <Icon as={FaFutbol} boxSize={16} color="red.500" mb={4} />
              <Heading as="h3" size="lg">
                Real-Time Availability
              </Heading>
              <Text mt={4}>
                Check real-time availability of futsal courts and avoid
                conflicts.
              </Text>
            </Box>

            <Box flex={1} textAlign="center">
              <Icon as={FaUserShield} boxSize={16} color="red.500" mb={4} />
              <Heading as="h3" size="lg">
                Admin Dashboard
              </Heading>
              <Text mt={4}>
                Manage bookings, users, and schedules efficiently from one
                place.
              </Text>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Map Section */}
      <Box bg="gray.50" py={10}>
        <Container maxW="container.md" textAlign="center">
          <Heading as="h3" size="lg" mb={4}>
            Visit Us
          </Heading>
          <Text mb={6}>
            Come and play at our futsal courts! Find us at the location below:
          </Text>
          <Box
            borderRadius="md"
            overflow="hidden"
            height="400px"
            boxShadow="lg"
          >
            <iframe
              title="Futsala Location"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d619.8340199593541!2d85.46114759362435!3d27.655935226620088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1smilanchowk%20bhaktapur!5e0!3m2!1sen!2snp!4v1732958753552!5m2!1sen!2snp"
              width="800"
              height="600"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
