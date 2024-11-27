import React, { useState } from "react";
import {
    useToast,
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Container,
    Heading,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateReservationForm = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Configure axios to include credentials
    axios.defaults.withCredentials = true;

    const formik = useFormik({
        initialValues: {
            dateTime: "",
            duration: "",
        },
        onSubmit: async (values, { resetForm }) => {
            const controller = new AbortController();
            setIsSubmitting(true);

            try {
                // Format the date manually to `YYYY-MM-DDTHH:MM` (local time)
                const dateTimeLocal = values.dateTime.replace("T", " ");

                const response = await axios.post(
                    `http://localhost:8000/api/users/create_reserves/`,
                    {
                        date_time: dateTimeLocal, // Send local datetime without converting to UTC
                        duration: parseInt(values.duration),
                    },
                    {
                        signal: controller.signal,
                        withCredentials: true,
                    }
                );

                toast({
                    title: "Reservation Created",
                    description:
                        "Your reservation has been successfully created.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                resetForm();
            } catch (error) {
                if (!axios.isCancel(error)) {
                    if (error.response?.status === 401) {
                        navigate("/login");
                        toast({
                            title: "Authentication Required",
                            description:
                                "Please log in to create a reservation",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    } else {
                        toast({
                            title: "Reservation Failed",
                            description:
                                error.response?.data?.detail ||
                                "An error occurred",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                }
            } finally {
                setIsSubmitting(false);
            }

            return () => controller.abort();
        },
    });

    return (
        <Container maxW="md" mt={10}>
            <Box
                borderWidth={1}
                borderRadius="lg"
                p={6}
                boxShadow="0 0 30px 0 #38664150"
            >
                <Heading mb={6}>Create Reservation</Heading>
                <form onSubmit={formik.handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl id="dateTime" isRequired>
                            <FormLabel>Date and Time</FormLabel>
                            <Input
                                type="datetime-local"
                                name="dateTime"
                                value={formik.values.dateTime}
                                onChange={formik.handleChange}
                            />
                        </FormControl>
                        <FormControl id="duration" isRequired>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <Input
                                type="number"
                                name="duration"
                                value={formik.values.duration}
                                onChange={formik.handleChange}
                            />
                        </FormControl>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            width="full"
                            isLoading={isSubmitting}
                        >
                            Create Reservation
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default CreateReservationForm;
