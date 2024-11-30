import React, { useState } from "react";
import { Box, Button, Grid, GridItem, Text, useToast } from "@chakra-ui/react";
import dayjs from "dayjs";

const TimeSelector = ({
  selectedDate,
  selectedDateTime,
  setSelectedDateTime,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startHour, setStartHour] = useState(null);

  // Helper: Get the current date's entry in `selectedDateTime`
  const getCurrentDateEntry = () =>
    selectedDateTime.find(([date]) => dayjs(date).isSame(selectedDate, "day"));

  // Helper: Merge ranges to avoid overlaps or duplicates
  const mergeRanges = (ranges) => {
    if (!ranges.length) return [];
    const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
    const merged = [sortedRanges[0]];
    for (let i = 1; i < sortedRanges.length; i++) {
      const last = merged[merged.length - 1];
      const current = sortedRanges[i];
      if (current.start <= last.end + 1) {
        last.end = Math.max(last.end, current.end);
      } else {
        merged.push(current);
      }
    }
    return merged;
  };

  // Update or add a new date-time range entry
  const updateDateTime = (newRange) => {
    setSelectedDateTime((prev) => {
      const otherEntries = prev.filter(
        ([date]) => !dayjs(date).isSame(selectedDate, "day")
      );
      const currentEntry = getCurrentDateEntry();
      const currentRanges = currentEntry ? currentEntry[1] : [];
      const updatedRanges = mergeRanges([...currentRanges, newRange]);
      return [...otherEntries, [selectedDate.toISOString(), updatedRanges]];
    });
  };

  const handleMouseDown = (hour) => {
    setIsSelecting(true);
    setStartHour(hour);
  };

  const handleMouseEnter = (hour) => {
    if (isSelecting && startHour !== null) {
      const newRange =
        startHour < hour
          ? { start: startHour, end: hour }
          : { start: hour, end: startHour };

      const currentEntry = getCurrentDateEntry();
      const currentRanges = currentEntry ? currentEntry[1] : [];
      const updatedRanges = mergeRanges([...currentRanges, newRange]);
      setSelectedDateTime((prev) => {
        const otherEntries = prev.filter(
          ([date]) => !dayjs(date).isSame(selectedDate, "day")
        );
        return [...otherEntries, [selectedDate.toISOString(), updatedRanges]];
      });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      setStartHour(null);
    }
  };

  const isHourSelected = (hour) => {
    const currentEntry = getCurrentDateEntry();
    if (!currentEntry) return false;

    const currentRanges = currentEntry[1];
    return currentRanges.some(({ start, end }) => hour >= start && hour <= end);
  };

  // Deselect or split the time range
  const handleDeselect = (hour) => {
    const currentEntry = getCurrentDateEntry();
    if (!currentEntry) return;

    const currentRanges = currentEntry[1];
    const updatedRanges = currentRanges.map((range) => {
      if (hour >= range.start && hour <= range.end) {
        // If hour is within the range, split or remove it
        if (hour === range.start && hour === range.end) {
          // If it's the exact start and end of the range, remove it
          return null;
        } else if (hour === range.start) {
          // Split the range by updating the start time
          return { start: hour + 1, end: range.end };
        } else if (hour === range.end) {
          // Split the range by updating the end time
          return { start: range.start, end: hour - 1 };
        } else {
          // Split into two ranges if the hour is in the middle
          return [
            { start: range.start, end: hour - 1 },
            { start: hour + 1, end: range.end },
          ];
        }
      }
      return range;
    });

    // Remove null values and merge ranges again
    const flattenedRanges = updatedRanges.flat().filter(Boolean);
    setSelectedDateTime((prev) => {
      const otherEntries = prev.filter(
        ([date]) => !dayjs(date).isSame(selectedDate, "day")
      );
      const updatedRanges = mergeRanges(flattenedRanges);
      return [...otherEntries, [selectedDate.toISOString(), updatedRanges]];
    });
  };

  return (
    <Box onMouseLeave={handleMouseUp}>
      <Text mb={4} fontWeight="bold">
        Select Time Ranges:
      </Text>
      <Grid templateColumns="repeat(6, 1fr)" gap={2}>
        {hours.map((hour) => (
          <GridItem
            key={hour}
            p={2}
            textAlign="center"
            cursor="pointer"
            bg={isHourSelected(hour) ? "blue.500" : "gray.100"}
            color={isHourSelected(hour) ? "white" : "black"}
            borderRadius="md"
            onMouseDown={() => handleMouseDown(hour)}
            onMouseEnter={() => handleMouseEnter(hour)}
            onMouseUp={handleMouseUp}
            onClick={() => handleDeselect(hour)} // Deselect if already selected
          >
            {dayjs().hour(hour).minute(0).format("h:mm A")}
          </GridItem>
        ))}
      </Grid>
      <Button
        mt={4}
        colorScheme="red"
        onClick={() => {
          setSelectedDateTime((prev) =>
            prev.filter(([date]) => !dayjs(date).isSame(selectedDate, "day"))
          );
        }}
        width="full"
      >
        Clear Selection
      </Button>
    </Box>
  );
};

export default TimeSelector;
