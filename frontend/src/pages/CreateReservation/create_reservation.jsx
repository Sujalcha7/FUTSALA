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

    // Configure global axios defaults
    axios.defaults.baseURL = "http://localhost:8000";
    axios.defaults.withCredentials = true;

    const formik = useFormik({
        initialValues: {
            dateTime: "",
            duration: "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.dateTime) {
                errors.dateTime = "Date and time are required";
            }
            if (!values.duration) {
                errors.duration = "Duration is required";
            }
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);

            try {
                // Convert datetime to ISO string
                const isoDateTime = new Date(values.dateTime).toISOString();

                const response = await axios.post(
                    "http://localhost:8000/api/users/create_reserves/",
                    {
                        date_time: isoDateTime,
                        duration: Number(values.duration), // Use Number() instead of parseInt
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
                navigate("/reservations"); // Optional: redirect after successful reservation
            } catch (error) {
                console.error("Reservation Error:", error);

                const errorMessage =
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "An unexpected error occurred";

                toast({
                    title: "Reservation Failed",
                    description: errorMessage,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });

                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <Container maxW="md" mt={10} mb={450}>
            <Box
                borderWidth={1}
                borderRadius="lg"
                p={6}
                boxShadow="0 0 30px 0 #38664150"
            >
                <Heading mb={6}>Create Reservation</Heading>
                <form onSubmit={formik.handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl
                            id="dateTime"
                            isRequired
                            isInvalid={
                                formik.touched.dateTime &&
                                formik.errors.dateTime
                            }
                        >
                            <FormLabel>Date and Time</FormLabel>
                            <Input
                                type="datetime-local"
                                name="dateTime"
                                value={formik.values.dateTime}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.dateTime &&
                                formik.errors.dateTime && (
                                    <Box color="red.500">
                                        {formik.errors.dateTime}
                                    </Box>
                                )}
                        </FormControl>
                        <FormControl
                            id="duration"
                            isRequired
                            isInvalid={
                                formik.touched.duration &&
                                formik.errors.duration
                            }
                        >
                            <FormLabel>Duration (minutes)</FormLabel>
                            <Input
                                type="number"
                                name="duration"
                                value={formik.values.duration}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                min={1} // Optional: Prevent zero or negative duration
                            />
                            {formik.touched.duration &&
                                formik.errors.duration && (
                                    <Box color="red.500">
                                        {formik.errors.duration}
                                    </Box>
                                )}
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
