import React, { useState } from "react";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

const TimeSelector = ({ selectedDate, selectedRanges, setSelectedRanges }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startHour, setStartHour] = useState(null);

  // Helper: Get the current date's entry in `selectedRanges`
  const getCurrentDateEntry = () =>
    selectedRanges.find(([date]) => dayjs(date).isSame(selectedDate, "day"));

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

  const clearSelection = () => {
    setSelectedRanges((prev) =>
      prev.filter(([date]) => !dayjs(date).isSame(selectedDate, "day"))
    );
  };

  // Handle selecting or deselecting an hour
  const handleHourClick = (hour) => {
    const currentEntry = getCurrentDateEntry();
    const currentRanges = currentEntry ? currentEntry[1] : [];

    const isSelected = currentRanges.some(
      ({ start, end }) => hour >= start && hour <= end
    );
    if (isSelected) {
      if (
        currentRanges.length === 1 &&
        currentRanges[0].start === currentRanges[0].end
      ) {
        clearSelection();
      } else {
        const updatedRanges = currentRanges
          .map((range) => {
            if (hour >= range.start && hour <= range.end) {
              if (hour === range.start && hour === range.end) {
                return null;
              } else if (hour === range.start) {
                return { start: hour + 1, end: range.end };
              } else if (hour === range.end) {
                return { start: range.start, end: hour - 1 };
              } else {
                return [
                  { start: range.start, end: hour - 1 },
                  { start: hour + 1, end: range.end },
                ];
              }
            }
            return range;
          })
          .flat()
          .filter(Boolean);

        setSelectedRanges((prev) => {
          const otherEntries = prev.filter(
            ([date]) => !dayjs(date).isSame(selectedDate, "day")
          );
          return [...otherEntries, [selectedDate.toISOString(), updatedRanges]];
        });
      }
    } else {
      const newRange = { start: hour, end: hour };
      const updatedRanges = mergeRanges([...currentRanges, newRange]);

      setSelectedRanges((prev) => {
        const otherEntries = prev.filter(
          ([date]) => !dayjs(date).isSame(selectedDate, "day")
        );
        return [...otherEntries, [selectedDate.toISOString(), updatedRanges]];
      });
    }
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

      setSelectedRanges((prev) => {
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

  const noSelectElements = document.querySelectorAll(".no-select");

  noSelectElements.forEach((element) => {
    element.style.webkitUserSelect = "none";
    element.style.mozUserSelect = "none";
    element.style.msUserSelect = "none";
    element.style.userSelect = "none";
  });

  return (
    <Box>
      <Text mb={4} fontWeight="bold">
        Select Time Ranges:
      </Text>

      {/* Hour Labels Row
      <Grid templateColumns="repeat(24, 1fr)" gap={2} mb={2}>
        {hours.map((hour) => (
          <Text key={hour} textAlign="center" fontWeight="bold" fontSize="sm">
            {dayjs().hour(hour).minute(0).format("HH")}
          </Text>
        ))}
      </Grid> */}

      {/* Circular Grid for Time Selection */}
      <Box position="relative" width="300px" height="300px" margin="auto">
        <Box
          key="circle"
          position="absolute"
          top="50%"
          left="50%"
          width="100%"
          height="100%"
          style={{ transformOrigin: "center" }}
        >
          {hours.map((hour, index) => {
            const angle = (360 / 24) * index + 270; // 15 degrees per slice
            const selected = isHourSelected(hour);
            const rotateAngle = `rotate(${
              angle + 7.5
            }deg) translate(100px) rotate(-${angle + 180 - index * 15}deg)`; // Rotate each slice
            const rotateAngleLabel = `rotate(${angle}deg) translate(130px) rotate(-${angle}deg)`; // Rotate each slice

            return (
              <>
                <Box
                  key={hour}
                  position="absolute"
                  width="28px"
                  height="24px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bg={selected ? "blue.500" : "gray.100"}
                  color={selected ? "white" : "black"}
                  // borderRadius="50%"
                  cursor="pointer"
                  transform={rotateAngle}
                  // transformOrigin="50% 50%" // Set the origin to the center of the circle
                  // clipPath="circle(50%)" // Circular box
                  // clipPath="polygon(50% 0%, 100% 100%, 0% 100%);"
                  onMouseDown={() => handleMouseDown(hour)}
                  onMouseEnter={() => handleMouseEnter(hour)}
                  onMouseUp={handleMouseUp}
                  onClick={() => handleHourClick(hour)}
                ></Box>

                <Text
                  position="absolute"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="50%"
                  transform={rotateAngleLabel}
                  transformOrigin="50% 50%"
                >
                  {dayjs().hour(hour).format("H")}
                </Text>
              </>
            );
          })}
        </Box>
      </Box>

      <Button
        // mt={4}
        mt="80px"
        colorScheme="red"
        onClick={clearSelection}
        width="full"
      >
        Clear Selection
      </Button>
    </Box>
  );
};

export default TimeSelector;
