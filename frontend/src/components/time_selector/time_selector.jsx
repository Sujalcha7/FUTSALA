import React, { useState } from "react";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

const TimeSelector = ({
    selectedDate,
    selectedRanges,
    setSelectedRanges,
    alreadyReservedRange,
}) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startHour, setStartHour] = useState(null);

    // Check if the selected date is before today
    const isDateInvalid = dayjs(selectedDate).isBefore(dayjs(), "day");

    // Helper: Get the current date's entry in `selectedRanges`
    const getCurrentDateEntry = () =>
        selectedRanges.find(([date]) =>
            dayjs(date).isSame(selectedDate, "day")
        );

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
        if (isHourReserved(hour) || isHourInvalid(hour)) return;
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
                    return [
                        ...otherEntries,
                        [selectedDate.toISOString(), updatedRanges],
                    ];
                });
            }
        } else {
            const newRange = { start: hour, end: hour };
            const updatedRanges = mergeRanges([...currentRanges, newRange]);

            setSelectedRanges((prev) => {
                const otherEntries = prev.filter(
                    ([date]) => !dayjs(date).isSame(selectedDate, "day")
                );
                return [
                    ...otherEntries,
                    [selectedDate.toISOString(), updatedRanges],
                ];
            });
        }
    };

    const handleMouseDown = (hour) => {
        if (isHourReserved(hour) || isHourInvalid(hour)) return;
        setIsSelecting(true);
        setStartHour(hour);
    };

    const handleMouseEnter = (hour) => {
        if (isHourReserved(hour) || isHourInvalid(hour)) return;
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
                return [
                    ...otherEntries,
                    [selectedDate.toISOString(), updatedRanges],
                ];
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
        return currentRanges.some(
            ({ start, end }) => hour >= start && hour <= end
        );
    };

    const isHourReserved = (hour) => {
        return alreadyReservedRange.some(
            ({ start, end }) => hour >= start && hour <= end
        );
    };

    // New function to check if hour is invalid
    const isHourInvalid = (hour) => {
        if (isDateInvalid) return true;

        // If it's today, prevent selecting past hours
        if (dayjs(selectedDate).isSame(dayjs(), "day")) {
            return hour - 1 < dayjs().hour();
        }

        return false;
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

            <Box
                key="circle-frame"
                position="relative"
                width="300px"
                height="300px"
                margin="auto"
            >
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
                        const isSelected = isHourSelected(hour);
                        const isReserved = isHourReserved(hour);
                        const isInvalid = isHourInvalid(hour);
                        const rotateAngle = `rotate(${
                            angle + 7.5
                        }deg) translate(100px) rotate(-${
                            angle + 180 - index * 15
                        }deg)`; // Rotate each slice
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
                                    bg={
                                        isInvalid
                                            ? "gray.400" // New color for invalid hours
                                            : isReserved
                                            ? "red.300"
                                            : isSelected
                                            ? "blue.500"
                                            : "gray.100"
                                    }
                                    color={
                                        isInvalid
                                            ? "gray.500" // Adjusted text color for invalid hours
                                            : isReserved
                                            ? "green.200"
                                            : isSelected
                                            ? "black"
                                            : "black"
                                    }
                                    cursor={
                                        isInvalid || isReserved
                                            ? "not-allowed"
                                            : "pointer"
                                    }
                                    transform={rotateAngle}
                                    onMouseDown={() =>
                                        !isInvalid &&
                                        !isReserved &&
                                        handleMouseDown(hour)
                                    }
                                    onMouseEnter={() =>
                                        !isInvalid &&
                                        !isReserved &&
                                        handleMouseEnter(hour)
                                    }
                                    onMouseUp={handleMouseUp}
                                    onClick={() =>
                                        !isInvalid &&
                                        !isReserved &&
                                        handleHourClick(hour)
                                    }
                                    userSelect="none"
                                >
                                    {dayjs().hour(hour).minute(0).format("h")}
                                </Box>
                                {/* <Text
                  position="absolute"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="50%"
                  transform={rotateAngleLabel}
                  transformOrigin="50% 50%"
                  userSelect="none"
                >
                  {dayjs().hour(hour).minute(0).format("h")}
                </Text> */}
                            </>
                        );
                    })}
                </Box>
            </Box>

            <Button
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
