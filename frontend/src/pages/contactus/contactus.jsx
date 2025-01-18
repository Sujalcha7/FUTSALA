import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Flex,
    Image,
    Text,
    Button,
    Input,
    Textarea,
} from "@chakra-ui/react";

import "./contactus.css";
import logo from "./../../assets/IMG_2967.png";

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false); // State variable to track form submission status  state initialize

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://formspree.io/f/myyrbrab", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log("Email sent successfully");
                setSubmitted(true); // Update state to indicate successful submission
                setFormData({ name: "", email: "", message: "" }); // Clear form fields
            } else {
                console.error("Error sending email");
            }
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    return (
        <Box maxW="1200px" mt={10} mb={10} mx="auto" p={5}>
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
                    mr={{ md: -90 }}
                    ml={{ md: -90 }}
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
                        Contact Us
                    </Text>

                    {!submitted ? (
                        <form onSubmit={handleSubmit}>
                            <Box mb={4}>
                                <Text>Name:</Text>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Box>
                            <Box mb={4}>
                                <Text>Email:</Text>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Box>
                            <Box mb={4}>
                                <Text>Message:</Text>
                                <Textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </Box>
                            <Button type="submit" colorScheme="teal">
                                Submit
                            </Button>
                        </form>
                    ) : (
                        <Text className="FormSubmittedMessage">
                            Form Submitted!
                        </Text>
                    )}

                    <Box mt={8}>
                        <Text as="h3" fontSize="xl" mb={2}>
                            Our Contact Information
                        </Text>
                        <Text>
                            Email:{" "}
                            <Link
                                href="mailto:kadelsubekshya@gmail.com"
                                color="blue.500"
                            >
                                kadelsubekshya@gmail.com
                            </Link>
                        </Text>
                        <Text>
                            Phone:{" "}
                            <Link href="tel:+9779743999851" color="blue.500">
                                +977 9743999851
                            </Link>
                        </Text>
                    </Box>

                    <Box mt={8}>
                        <Button as={Link} to="/" colorScheme="teal">
                            Back to home
                        </Button>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default ContactUsPage;
