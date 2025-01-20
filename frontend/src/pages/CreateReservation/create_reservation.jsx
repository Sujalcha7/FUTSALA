import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useToast, Container, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import DateTimePicker from "../../components/date_picker/date_picker";

const CreateReservationForm = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRanges, setSelectedRanges] = useState([]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (selectedRanges.length === 0)
                throw new Error("No time ranges selected");

            await Promise.all(
                selectedRanges.map(async ([date, ranges]) => {
                    for (const { start, end } of ranges) {
                        // Fix: Properly handle timezone and time components
                        const start_isoDateTime = dayjs(date)
                            .startOf("hour") // Ensure we start at the beginning of the hour
                            .hour(start)
                            .format(); // Using format() instead of toISOString() to preserve timezone

                        const end_isoDateTime = dayjs(date)
                            .startOf("hour")
                            .hour(end)
                            .format();

                        await axios.post(
                            "http://localhost:8000/api/create_reservation/",
                            {
                                start_date_time: start_isoDateTime,
                                end_date_time: end_isoDateTime,
                                rate: 1000,
                            }
                        );
                    }
                })
            );
            const formattedSelections = selectedRanges
                .map(([date, ranges]) => {
                    const formattedRanges = ranges
                        .map(({ start, end }) => {
                            const startTime = dayjs(date) // Use the selected date here
                                .startOf("hour")
                                .hour(start)
                                .format("h:mm A");
                            const endTime = dayjs(date) // Use the selected date here
                                .startOf("hour")
                                .hour(end)
                                .format("h:mm A");
                            return `${startTime} - ${endTime}`;
                        })
                        .join(", ");
                    return `${dayjs(date).format(
                        "YYYY/MM/DD"
                    )}: ${formattedRanges}`;
                })
                .join("\n");

            toast({
                title: "Reservations Created",
                description: formattedSelections,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/profile"); // Optional: redirect after successful reservation
        } catch (error) {
            console.error("Reservation Error:", error);

            toast({
                title: "Reservation Failed",
                description: error.message || "An error occurred",
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
    };

    return (
        <Container maxW="90rem" mt={10} mb={450}>
            <DateTimePicker
                selectedRanges={selectedRanges}
                setSelectedRanges={setSelectedRanges}
            />
            <Button
                colorScheme="blue"
                type="submit"
                width="full"
                isLoading={isSubmitting}
                onClick={handleSubmit}
            >
                Create Reservation
            </Button>
        </Container>
    );
};

export default CreateReservationForm;
