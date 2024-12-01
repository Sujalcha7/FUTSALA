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
              .hour(end)
              .toDate()
              .toISOString();
            console.log(start_isoDateTime, end_isoDateTime);

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
                  .hour(end)
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
      {/* <Box
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
              isInvalid={formik.touched.dateTime && formik.errors.dateTime}
            >
              <FormLabel>Date and Time</FormLabel>
              <Input
                type="datetime-local"
                name="dateTime"
                value={formik.values.dateTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dateTime && formik.errors.dateTime && (
                <Box color="red.500">{formik.errors.dateTime}</Box>
              )}
            </FormControl>
            <FormControl
              id="duration"
              isRequired
              isInvalid={formik.touched.duration && formik.errors.duration}
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
              {formik.touched.duration && formik.errors.duration && (
                <Box color="red.500">{formik.errors.duration}</Box>
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
      </Box> */}

      {/* <form onSubmit={formik.handleSubmit}> */}
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
      {/* </form> */}
    </Container>
  );
};

export default CreateReservationForm;
