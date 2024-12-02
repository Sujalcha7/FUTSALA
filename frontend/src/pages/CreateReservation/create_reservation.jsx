import React, { useState } from "react";
import dayjs from "dayjs";
import {
  useToast,
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Container,
  Heading,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DateTimePicker from "../../components/date_picker/date_picker";

const CreateReservationForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRanges, setSelectedRanges] = useState([]);

  // Configure global axios defaults
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = true;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (selectedRanges.length === 0) throw "No time ranges selected";
      await Promise.all(
        selectedRanges.map(async ([date, ranges]) => {
          for (const { start, end } of ranges) {
            const start_isoDateTime = dayjs(date)
              .hour(start)
              .toDate()
              .toISOString();
            const end_isoDateTime = dayjs(date)
              .hour(end + 1)
              .toDate()
              .toISOString();
            console.log(date, start_isoDateTime, end_isoDateTime);

            await axios.post(
              "http://localhost:8000/api/users/create_reserves/",
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
            .map(
              ({ start, end }) =>
                `${dayjs().hour(start).minute(0).format("h:mm A")} - ${dayjs()
                  .hour(end + 1)
                  .minute(0)
                  .format("h:mm A")}`
            )
            .join(", ");
          return `${dayjs(date).format("YYYY/MM/DD")}: ${formattedRanges}`;
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
        description: error,
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
