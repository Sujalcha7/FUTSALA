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
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
    return (
        <Box bg="gray.900" color="white" py={20} id="contact-us" mt={0}>
            <Container maxW="container.xl">
                {/* Section Header */}
                <VStack spacing={6} textAlign="center" mb={12}>
                    <Heading as="h2" size="xl">
                        Get in Touch
                    </Heading>
                    <Text fontSize="lg" color="gray.400">
                        We'd love to hear from you! Feel free to reach out via
                        the form below or connect with us on social media.
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
    );
};

export default Footer;
