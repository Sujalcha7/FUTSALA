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
  const daysInMonth = Array.from(
    { length: selectedDate.daysInMonth() },
    (_, i) => i + 1
  );

  // Update month navigation
  const handleMonthChange = (direction) => {
    setSelectedDate((prevDate) => prevDate.add(direction, "month"));
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
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
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
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedDateTime, setSelectedDateTime] = useState([]);
  const toast = useToast();

  const handleConfirm = () => {
    if (selectedDateTime.length === 0) {
      toast({
        title: "No time ranges selected",
        description: "Please select at least one time range.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formattedSelections = selectedDateTime
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
              selectedDateTime={selectedDateTime}
              setSelectedDateTime={setSelectedDateTime}
            />
          </Flex>
        </Box>

        {/* Display Selected Date-Time Pairs */}
        <Box flex="1" borderWidth={1} borderRadius="md" p={4} boxShadow="md">
          <Heading size="md" mb={4}>
            Selected Ranges
          </Heading>
          {selectedDateTime.length === 0 ? (
            <Text color="gray.500">No selections made.</Text>
          ) : (
            <List spacing={3}>
              {selectedDateTime.map(([date, ranges], index) => (
                <ListItem key={index}>
                  <Text fontWeight="bold">
                    {dayjs(date).format("YYYY/MM/DD")}:
                  </Text>
                  <List spacing={1} pl={4}>
                    {ranges.map(({ start, end }, rangeIndex) => (
                      <ListItem key={rangeIndex}>
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
