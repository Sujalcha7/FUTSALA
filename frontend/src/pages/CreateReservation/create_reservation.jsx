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
import axios from "axios";

const CreateReservationForm = () => {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            dateTime: "",
            duration: "",
        },
        onSubmit: async (values, { resetForm }) => {
            const controller = new AbortController();
            setIsSubmitting(true);

            try {
                const userId = 1; // Replace with actual user ID from auth
                await axios.post(
                    `/api/users/${userId}/reserves/`,
                    {
                        date_time: new Date(values.dateTime).toISOString(),
                        duration: parseInt(values.duration),
                    },
                    {
                        signal: controller.signal,
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
                    toast({
                        title: "Reservation Failed",
                        description:
                            error.response?.data?.detail || "An error occurred",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } finally {
                setIsSubmitting(false);
            }

            return () => controller.abort();
        },
    });

    useEffect(() => {
        return () => {
            // Clean up any pending formik submissions
            if (isSubmitting) {
                formik.setSubmitting(false);
            }
        };
    }, [isSubmitting, formik]);

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
                        <Button colorScheme="blue" type="submit" width="full">
                            Create Reservation
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default CreateReservationForm;
