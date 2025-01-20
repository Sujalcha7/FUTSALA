import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Text,
    VStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Radio,
    RadioGroup,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    TimeIcon,
} from "@chakra-ui/icons";
import dayjs from "dayjs";
import axios from "axios";

const Calendar = ({ selectedDate, setSelectedDateAndUpdateRange }) => {
    const daysInMonth = Array.from(
        { length: selectedDate.daysInMonth() },
        (_, i) => i + 1
    );
    const firstDayOfMonth = selectedDate.startOf("month").day();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleMonthChange = (direction) => {
        const newDate = selectedDate.add(direction, "month");
        setSelectedDateAndUpdateRange(newDate);
    };

    return (
        <Box w="100%" maxW="400px">
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

            <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={2}>
                {daysOfWeek.map((day, index) => (
                    <GridItem key={index} textAlign="center" fontWeight="bold">
                        {day}
                    </GridItem>
                ))}
            </Grid>

            <Grid templateColumns="repeat(7, 1fr)" gap={2}>
                {Array(firstDayOfMonth)
                    .fill(null)
                    .map((_, index) => (
                        <GridItem key={`empty-${index}`} />
                    ))}
                {daysInMonth.map((day) => (
                    <GridItem
                        key={day}
                        p={2}
                        textAlign="center"
                        cursor="pointer"
                        bg={
                            selectedDate.date() === day
                                ? "blue.500"
                                : "gray.100"
                        }
                        color={selectedDate.date() === day ? "white" : "black"}
                        borderRadius="md"
                        onClick={() =>
                            setSelectedDateAndUpdateRange(
                                selectedDate.date(day)
                            )
                        }
                    >
                        {day}
                    </GridItem>
                ))}
            </Grid>
            <Box>
                <Text mt={8} bm={2}>
                    Select a day: {selectedDate.format("DD-MM-YYYY")}
                </Text>
            </Box>
        </Box>
    );
};

const TimeSelector = ({
    selectedDate,
    selectedRanges,
    setSelectedRanges,
    alreadyReservedRange,
}) => {
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const { isOpen: isStartTimeOpen, onToggle: onStartTimeToggle } =
        useDisclosure();
    const { isOpen: isEndTimeOpen, onToggle: onEndTimeToggle } =
        useDisclosure();

    const generateTimeSlots = () => {
        const slots = [];
        for (let i = 0; i < 24; i++) {
            slots.push({
                hour: i,
                display: dayjs().startOf("hour").hour(i).format("hh:mm A"),
            });
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const isTimeSlotReserved = (hour) => {
        return alreadyReservedRange.some(
            ({ start, end }) => hour >= start && hour <= end
        );
    };

    const handleTimeSelect = (hour, isStart) => {
        const currentDate = selectedDate.format("YYYY-MM-DD");

        if (isStart) {
            setSelectedStartTime(hour);
            if (selectedEndTime && hour >= selectedEndTime) {
                setSelectedEndTime(null);
            }
        } else {
            setSelectedEndTime(hour);

            // Update selectedRanges when both start and end times are selected
            if (selectedStartTime !== null) {
                const newRange = {
                    start: selectedStartTime,
                    end: hour,
                };

                setSelectedRanges((prev) => {
                    const otherDates = prev.filter(
                        ([date]) => !dayjs(date).isSame(selectedDate, "day")
                    );
                    return [...otherDates, [currentDate, [newRange]]];
                });
            }
        }
    };

    return (
        <VStack spacing={6} align="stretch" w="100%" maxW="400px">
            <Box>
                <Popover isOpen={isStartTimeOpen} onClose={onStartTimeToggle}>
                    <PopoverTrigger>
                        <Button
                            w="full"
                            mb={4}
                            variant="outline"
                            leftIcon={<TimeIcon />}
                            rightIcon={<ChevronDownIcon />}
                            onClick={onStartTimeToggle}
                        >
                            {selectedStartTime !== null
                                ? dayjs()
                                      .startOf("hour")
                                      .hour(selectedStartTime)
                                      .format("hh:mm A")
                                : "Start with"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverBody maxH="300px" overflowY="auto">
                            <RadioGroup value={selectedStartTime}>
                                <VStack align="stretch" spacing={2}>
                                    {timeSlots.map((slot) => (
                                        <Radio
                                            key={slot.hour}
                                            value={slot.hour}
                                            isDisabled={isTimeSlotReserved(
                                                slot.hour
                                            )}
                                            onChange={() =>
                                                handleTimeSelect(
                                                    slot.hour,
                                                    true
                                                )
                                            }
                                        >
                                            {slot.display}
                                        </Radio>
                                    ))}
                                </VStack>
                            </RadioGroup>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>

                <Popover isOpen={isEndTimeOpen} onClose={onEndTimeToggle}>
                    <PopoverTrigger>
                        <Button
                            w="full"
                            variant="outline"
                            leftIcon={<TimeIcon />}
                            rightIcon={<ChevronDownIcon />}
                            onClick={onEndTimeToggle}
                            isDisabled={!selectedStartTime}
                        >
                            {selectedEndTime !== null
                                ? dayjs()
                                      .startOf("hour")
                                      .hour(selectedEndTime)
                                      .format("hh:mm A")
                                : "End with"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverBody maxH="300px" overflowY="auto">
                            <RadioGroup value={selectedEndTime}>
                                <VStack align="stretch" spacing={2}>
                                    {timeSlots.map((slot) => (
                                        <Radio
                                            key={slot.hour}
                                            value={slot.hour}
                                            isDisabled={
                                                isTimeSlotReserved(slot.hour) ||
                                                slot.hour <= selectedStartTime
                                            }
                                            onChange={() =>
                                                handleTimeSelect(
                                                    slot.hour,
                                                    false
                                                )
                                            }
                                        >
                                            {slot.display}
                                        </Radio>
                                    ))}
                                </VStack>
                            </RadioGroup>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Box>

            {/* Selected Range Display */}
            {selectedRanges.length > 0 && (
                <Box borderWidth={1} borderRadius="md" p={4}>
                    <Text fontWeight="bold" mb={2}>
                        Selected Times:
                    </Text>
                    <VStack align="stretch" spacing={2}>
                        {selectedRanges.map(([date, ranges], index) => (
                            <Box key={index}>
                                <Text fontWeight="medium">
                                    {dayjs(date).format("DD.MM.YYYY")}
                                </Text>
                                {ranges.map(({ start, end }, rangeIndex) => (
                                    <Text key={rangeIndex} color="gray.600">
                                        {dayjs()
                                            .startOf("hour")
                                            .hour(start)
                                            .format("hh:mm A")}{" "}
                                        -
                                        {dayjs()
                                            .startOf("hour")
                                            .hour(end)
                                            .format("hh:mm A")}
                                    </Text>
                                ))}
                            </Box>
                        ))}
                    </VStack>
                </Box>
            )}
        </VStack>
    );
};

const HybridDateTimePicker = ({ selectedRanges, setSelectedRanges }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs().startOf("day"));
    const [alreadyReservedRanges, setAlreadyReservedRanges] = useState([]);

    const setSelectedDateAndUpdateRange = async (newDate) => {
        setSelectedDate(newDate);
        const isoDateTime = newDate.add(1, "day").toISOString();

        try {
            const response = await axios.get(
                "http://localhost:8000/api/reserves_by_day/",
                {
                    params: { date_time: isoDateTime },
                    withCredentials: true,
                }
            );

            if (response.data.length === 0) {
                setAlreadyReservedRanges([]);
                return;
            }

            const reservedRanges = response.data.map((dates) => ({
                start: dayjs(dates.start_date_time).hour(),
                end: dayjs(dates.end_date_time).hour() - 1,
            }));
            setAlreadyReservedRanges(reservedRanges);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    useEffect(() => {
        setSelectedDateAndUpdateRange(dayjs().startOf("day"));
    }, []);

    return (
        <Box maxW="6xl" mx="auto" mt={10} p={4}>
            <Heading size="lg" mb={6} textAlign="center">
                Date-Time Picker
            </Heading>
            <Flex
                direction={{ base: "column", md: "row" }}
                gap={8}
                align="flex-start"
            >
                <Calendar
                    selectedDate={selectedDate}
                    setSelectedDateAndUpdateRange={
                        setSelectedDateAndUpdateRange
                    }
                />
                <TimeSelector
                    selectedDate={selectedDate}
                    selectedRanges={selectedRanges}
                    setSelectedRanges={setSelectedRanges}
                    alreadyReservedRange={alreadyReservedRanges}
                />
            </Flex>
        </Box>
    );
};

export default HybridDateTimePicker;
