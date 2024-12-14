import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListItem,
  Text,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import TimeSelector from "../time_selector/time_selector";

// Calendar Component
const Calendar = ({ selectedDate, setSelectedDateAndUpdateRange }) => {
  const [retainSelectedDateOfMonth, setRetainSelectedDateOfMonth] = useState(
    {}
  );

  const daysInMonth = Array.from(
    { length: selectedDate.daysInMonth() },
    (_, i) => i + 1
  );

  // Get the first day of the month and adjust for the weekday (Sunday, Monday, etc.)
  const firstDayOfMonth = selectedDate.startOf("month").day();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Update month navigation
  const handleMonthChange = (direction) => {
    const currentMonthYearKey = selectedDate.format("YYYY-MM");

    // Save the currently selected date of the month
    setRetainSelectedDateOfMonth((prev) => ({
      ...prev,
      [currentMonthYearKey]: selectedDate,
    }));

    const newDate = selectedDate.add(direction, "month");
    const newMonthYearKey = newDate.format("YYYY-MM");

    // Check if the new month has a retained date
    if (retainSelectedDateOfMonth[newMonthYearKey]) {
      // If there's a retained selected date for the new month, use it
      setSelectedDateAndUpdateRange(retainSelectedDateOfMonth[newMonthYearKey]);
    } else {
      setSelectedDateAndUpdateRange(newDate.startOf("month")); // Otherwise, set the selected date to the first day of the new month
    }
  };

  return (
    <Box>
      <Flex align="center" justify="space-between" mb={4}>
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Previous month"
          onClick={() => handleMonthChange(-1)}
        />
        <Heading size="sm">{selectedDate.format("MMMM YYYY")}</Heading>
        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Next month"
          onClick={() => handleMonthChange(1)}
        />
      </Flex>

      {/* Weekday labels */}
      <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={2}>
        {daysOfWeek.map((day, index) => (
          <GridItem key={index} textAlign="center" fontWeight="bold">
            {day}
          </GridItem>
        ))}
      </Grid>

      {/* Days of the month */}
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {/* Empty spaces for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <GridItem key={`empty-${index}`} />
        ))}

        {daysInMonth.map((day) => (
          <GridItem
            key={day}
            p={2}
            textAlign="center"
            cursor="pointer"
            bg={selectedDate.date() === day ? "blue.500" : "gray.100"}
            color={selectedDate.date() === day ? "white" : "black"}
            borderRadius="md"
            onClick={() =>
              setSelectedDateAndUpdateRange(selectedDate.date(day))
            }
          >
            {day}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

// Main DateTimePicker Component
const DateTimePicker = ({ selectedRanges, setSelectedRanges }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("day"));
  const [alreadyReservedRanges, setAlreadyReservedRange] = useState([]);
  const toast = useToast();

  const setSelectedDateAndUpdateRange = async (newDate) => {
    setSelectedDate(newDate);
    const isoDateTime = String(dayjs(newDate).add(1, "day").toISOString());
    console.log(isoDateTime);
    const controller = new AbortController();
    try {
      const response = await axios.get(
        "http://localhost:8000/api/reserves_by_day/",
        {
          signal: controller.signal,
          params: { date_time: isoDateTime },
          withCredentials: true,
        }
      );
      if (response.data.length === 0) setAlreadyReservedRange([]);
      const start_end_dates = response.data;
      let reservedRange = [];
      start_end_dates.forEach((dates) => {
        const start_h = dayjs(dates.start_date_time).format("H");
        const end_h = dayjs(dates.end_date_time).format("H");
        reservedRange.push({ start: start_h - 0, end: end_h - 1 });
      });
      setAlreadyReservedRange(reservedRange);
      console.log(reservedRange);
    } catch (error) {
      console.log("error:", error);
      if (!axios.isCancel(error)) {
        toast({
          title: "Error Fetching Reservations by Day",
          description: error.response?.data?.detail || "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Run a function when the component loads
  useEffect(() => {
    const initializeComponent = () => {
      console.log("Component has loaded!");
      setSelectedDateAndUpdateRange(dayjs().startOf("day")); // Load initial data
    };

    initializeComponent();

    // Optional: Add a cleanup function if needed
    return () => {
      console.log("Component is unmounting...");
    };
  }, []); // Empty dependency array ensures this runs only once when the component loads

  return (
    <Box
      maxW="4xl"
      mx="auto"
      mt={10}
      p={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <Heading size="lg" mb={4} textAlign="center">
        Date-Time Picker
      </Heading>
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={6}
        align="flex-start"
      >
        <Box flex="2">
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={6}
            align="flex-start"
          >
            <Calendar
              selectedDate={selectedDate}
              setSelectedDateAndUpdateRange={setSelectedDateAndUpdateRange}
            />
            <TimeSelector
              selectedDate={selectedDate}
              selectedRanges={selectedRanges}
              setSelectedRanges={setSelectedRanges}
              alreadyReservedRange={alreadyReservedRanges}
            />
          </Flex>
        </Box>

        <Box flex="1" borderWidth={1} borderRadius="md" p={4} boxShadow="md">
          <Heading size="md" mb={4}>
            Selected Ranges
          </Heading>
          {selectedRanges.length === 0 ? (
            <Text color="gray.500">No selections made.</Text>
          ) : (
            <List spacing={3}>
              {selectedRanges.map(([date, ranges], index) => (
                <ListItem key={index}>
                  <Button
                    fontWeight="bold"
                    onClick={() => setSelectedDate(dayjs(date))}
                  >
                    {dayjs(date).format("YYYY/MM/DD")}:
                  </Button>
                  <List spacing={1} pl={4}>
                    {ranges.map(({ start, end }, rangeIndex) => (
                      <ListItem
                        key={rangeIndex}
                        onClick={() =>
                          console.log(selectedRanges, alreadyReservedRanges)
                        }
                      >
                        {dayjs().hour(start).minute(0).format("h:mm A")} -{" "}
                        {dayjs()
                          .hour(end + 1)
                          .minute(0)
                          .format("h:mm A")}
                      </ListItem>
                    ))}
                  </List>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default DateTimePicker;
