import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Image, Text, Button } from "@chakra-ui/react";
import logo from "../../assets/IMG_2967.png";
import "./aboutus.css";

const AboutUsPage = () => {
    return (
        <Box maxW="100%" mt={10} mb={100} mx="auto" p={5}>
            <Flex
                className="company-card"
                direction={{ base: "column", md: "row" }}
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                p={5}
            >
                {/* Logo Column */}
                <Flex
                    className="logo-column"
                    flex="1"
                    justifyContent="center"
                    alignItems="center"
                    mr={{ md: -70 }}
                    ml={{ md: -70 }}
                >
                    <Image
                        src={logo}
                        alt="Company Logo"
                        className="company-logo"
                        boxSize="200px"
                        objectFit="contain"
                    />
                </Flex>

                {/* Description Column */}
                <Box
                    className="description-column"
                    flex="2"
                    textAlign="justify"
                    p={5}
                >
                    <Text as="h2" fontSize="2xl" mb={4}>
                        About Us
                    </Text>

                    <Text mb={4}>
                        Welcome to FUTSALA, where the excitement of the game
                        meets the convenience of online reservations.
                    </Text>
                    <Text mb={4}>
                        Our platform offers a seamless booking system for futsal
                        enthusiasts, designed to make reserving your favorite
                        futsal court quick and hassle-free. Whether you're a
                        player looking to enjoy a thrilling match with friends
                        or an organizer managing a tournament, FUTSALA provides
                        a user-friendly platform where you can book futsal
                        courts in real-time.
                    </Text>
                    <Text mb={4}>
                        With our intuitive interface and dedicated support, you
                        can reserve a futsal court effortlessly, knowing that
                        you're part of a community that values fairness and
                        transparency. Join us at FUTSALA and experience a new
                        way to enjoy your favorite sport without the hassle of
                        traditional bookings.
                    </Text>
                    <Text mb={4}>
                        <Link
                            to="/contactus"
                            className="contact-link"
                            color="blue.500"
                        >
                            Contact us
                        </Link>{" "}
                        today to learn more about how we can help you achieve
                        your goals!
                    </Text>

                    <Button
                        as={Link}
                        to="/"
                        className="back-button"
                        colorScheme="teal"
                    >
                        Back to home
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
};

export default AboutUsPage;
