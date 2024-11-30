import React, { useState } from "react";
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
const Calendar = ({ selectedDate, setSelectedDate }) => {
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
      setSelectedDate(retainSelectedDateOfMonth[newMonthYearKey]);
    } else {
      // Otherwise, set the selected date to the first day of the new month
      setSelectedDate(newDate.startOf("month"));
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
            onClick={() => setSelectedDate(selectedDate.date(day))}
          >
            {day}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

// Main DateTimePicker Component
const DateTimePicker = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("day"));
  const [selectedRanges, setSelectedRanges] = useState([]);
  const toast = useToast();

  const handleConfirm = () => {
    if (selectedRanges.length === 0) {
      toast({
        title: "No time ranges selected",
        description: "Please select at least one time range.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
      title: "Date and Time Ranges Selected",
      description: formattedSelections,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

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
        {/* Calendar and Time Selector */}
        <Box flex="2">
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={6}
            align="flex-start"
          >
            {/* Calendar */}
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {/* Time Selector */}
            <TimeSelector
              selectedDate={selectedDate}
              selectedRanges={selectedRanges}
              setSelectedRanges={setSelectedRanges}
            />
          </Flex>
        </Box>

        {/* Display Selected Date-Time Pairs */}
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
                  <Text
                    fontWeight="bold"
                    onClick={() => setSelectedDate(dayjs(date))}
                  >
                    {dayjs(date).format("YYYY/MM/DD")}:
                  </Text>
                  <List spacing={1} pl={4}>
                    {ranges.map(({ start, end }, rangeIndex) => (
                      <ListItem
                        key={rangeIndex}
                        onClick={() => console.log(start, "-", end)}
                      >
                        {dayjs().hour(start).minute(0).format("h:mm A")} -{" "}
                        {dayjs().hour(end).minute(0).format("h:mm A")}
                      </ListItem>
                    ))}
                  </List>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Flex>

      {/* Confirm Button */}
      <Button mt={6} colorScheme="blue" width="full" onClick={handleConfirm}>
        Confirm
      </Button>
    </Box>
  );
};

export default DateTimePicker;
