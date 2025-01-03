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
  Link,
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
} from "react-icons/fa"; // Importing relevant icons
import futsalImage from "../../assets/futsalimg.jpg"; // Replace with your own image path

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgImage={`url(${futsalImage})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        minH="80vh"
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
                             onClick={() => console.log('Login options selected')}
                         >
                             Start booking
           </Button>
          </VStack>
        </Box>
      </Box>

      {/* Features Section */}
      <Box bg="white.800" color="black" py={20}>
        <Container maxW="container.xl">
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={12}
            justify="space-between"
          >
            <Box flex={1} textAlign="center">
              <Icon as={FaCalendarAlt} boxSize={16} color="gray.600" mb={4} />
              <Heading as="h3" size="lg">
                Easy Booking
              </Heading>
              <Text mt={4}>
                Seamlessly book your preferred time slots with our easy-to-use
                calendar.
              </Text>
            </Box>

            <Box flex={1} textAlign="center">
              <Icon as={FaFutbol} boxSize={16} color="gray.600" mb={4} />
              <Heading as="h3" size="lg">
                Real-Time Availability
              </Heading>
              <Text mt={4}>
                Check real-time availability of futsal courts and avoid
                conflicts.
              </Text>
            </Box>

            <Box flex={1} textAlign="center">
              <Icon as={FaUserShield} boxSize={16} color="gray.600" mb={4} />
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

      {/* Contact Section */}
      <Box bg="gray.800" color="white" py={20} id="contact-us">
        <Container maxW="container.xl">
          {/* Section Header */}
          <VStack spacing={6} textAlign="center" mb={12}>
            <Heading as="h2" size="xl">
              Get in Touch
            </Heading>
            <Text fontSize="lg" color="gray.400">
              We'd love to hear from you! Feel free to reach out via the form
              below or connect with us on social media.
            </Text>
          </VStack>


          {/* Social Media Links */}
          <Stack direction="row" spacing={6} justify="center">
            <Link href="https://facebook.com" isExternal>
              <Icon as={FaFacebook} boxSize={8} color="white" />
            </Link>

            <Link href="https://instagram.com" isExternal>
              <Icon as={FaInstagram} boxSize={8} color="white" />
            </Link>

            <Link href="https://linkedin.com" isExternal>
              <Icon as={FaLinkedin} boxSize={8} color="white" />
            </Link>

            <Link href="https://twitter.com" isExternal>
              <Icon as={FaTwitter} boxSize={8} color="white" />
            </Link>

            <Link href="https://youtube.com" isExternal>
              <Icon as={FaYoutube} boxSize={8} color="white" />
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

