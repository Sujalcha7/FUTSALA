import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Card,
    CardBody,
    CardHeader,
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
    HStack,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    TimeIcon,
    HamburgerIcon,
} from "@chakra-ui/icons";
import dayjs from "dayjs";
import axios from "axios";

const Calendar = ({ selectedDate, setSelectedDateAndUpdateRange }) => {
    const daysInMonth = Array.from(
        { length: selectedDate.daysInMonth() },
        (_, i) => i + 1
    );
    const firstDayOfMonth = selectedDate.startOf("month").day();
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const handleMonthChange = (direction) => {
        const newDate = selectedDate.add(direction, "month");
        setSelectedDateAndUpdateRange(newDate);
    };

    return (
        <Card w="100%" bg="#ffffff" borderRadius="lg" boxShadow="md">
            <CardHeader>
                <Flex align="center" justify="space-between" width="100%">
                    <IconButton
                        icon={<ChevronLeftIcon />}
                        aria-label="Previous month"
                        onClick={() => handleMonthChange(-1)}
                        colorScheme="#272643"
                        variant="ghost"
                    />
                    <Heading size="lg" color="#272643" textAlign="center">
                        {selectedDate.format("MMMM YYYY")}
                    </Heading>
                    <IconButton
                        icon={<ChevronRightIcon />}
                        aria-label="Next month"
                        onClick={() => handleMonthChange(1)}
                        colorScheme="#272643"
                        variant="ghost"
                    />
                </Flex>
            </CardHeader>
            <CardBody>
                <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={4}>
                    {daysOfWeek.map((day, index) => (
                        <GridItem
                            key={index}
                            textAlign="center"
                            color="gray.400"
                        >
                            {day}
                        </GridItem>
                    ))}
                </Grid>

                <Grid
                    templateColumns="repeat(7, 1fr)"
                    gap={2}
                    placeItems="center"
                >
                    {Array(firstDayOfMonth)
                        .fill(null)
                        .map((_, index) => (
                            <GridItem key={`empty-${index}`} />
                        ))}
                    {daysInMonth.map((day) => (
                        <GridItem
                            key={day}
                            p={4}
                            textAlign="center"
                            cursor="pointer"
                            bg={
                                selectedDate.date() === day
                                    ? "#2c698d"
                                    : "#ffffff"
                            }
                            color={
                                selectedDate.date() === day ? "white" : "black"
                            }
                            borderRadius="md"
                            onClick={() =>
                                setSelectedDateAndUpdateRange(
                                    selectedDate.date(day)
                                )
                            }
                            _hover={{
                                bg:
                                    selectedDate.date() === day
                                        ? "#2c698d"
                                        : "#bae8e8",
                            }}
                            aspectRatio={1}
                        >
                            {day}
                        </GridItem>
                    ))}
                </Grid>
            </CardBody>
        </Card>
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
                full: dayjs().hour(i).minute(0).format("HH:mm"),
                display: dayjs().hour(i).minute(0).format("hh:mm A"),
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

    const calculateTotalDuration = () => {
        if (selectedStartTime !== null && selectedEndTime !== null) {
            return selectedEndTime - selectedStartTime;
        }
        return 0;
    };

    const ratePerHour = 1000;
    const totalDuration = calculateTotalDuration();
    const totalAmount = totalDuration * ratePerHour;

    return (
        <Card w="100%" bg="#ffffff" borderRadius="lg" boxShadow="md">
            <CardHeader>
                <Heading size="md" color="#2c698d">
                    Select available slots to continue!
                </Heading>
            </CardHeader>
            <CardBody>
                <Grid templateColumns="60% 40%" gap={6}>
                    {/* Left Column - Time Selection */}
                    <GridItem>
                        <VStack spacing={4} align="stretch">
                            <HStack spacing={4} align="stretch">
                                <Popover
                                    isOpen={isStartTimeOpen}
                                    onClose={onStartTimeToggle}
                                >
                                    <PopoverTrigger>
                                        <Button
                                            w="full"
                                            variant="outline"
                                            leftIcon={<TimeIcon />}
                                            rightIcon={<ChevronDownIcon />}
                                            onClick={onStartTimeToggle}
                                            colorScheme="red"
                                        >
                                            {selectedStartTime !== null
                                                ? dayjs()
                                                      .hour(selectedStartTime)
                                                      .format("hh:mm A")
                                                : "Start with"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent bg="gray.700">
                                        <PopoverBody
                                            maxH="300px"
                                            overflowY="auto"
                                        >
                                            <RadioGroup
                                                value={selectedStartTime}
                                            >
                                                <VStack
                                                    align="stretch"
                                                    spacing={2}
                                                >
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
                                                            colorScheme="red"
                                                        >
                                                            <Text color="white">
                                                                {slot.display}
                                                            </Text>
                                                        </Radio>
                                                    ))}
                                                </VStack>
                                            </RadioGroup>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>

                                <Popover
                                    isOpen={isEndTimeOpen}
                                    onClose={onEndTimeToggle}
                                >
                                    <PopoverTrigger>
                                        <Button
                                            w="full"
                                            variant="outline"
                                            leftIcon={<TimeIcon />}
                                            rightIcon={<ChevronDownIcon />}
                                            onClick={onEndTimeToggle}
                                            isDisabled={!selectedStartTime}
                                            colorScheme="red"
                                        >
                                            {selectedEndTime !== null
                                                ? dayjs()
                                                      .hour(selectedEndTime)
                                                      .format("hh:mm A")
                                                : "End with"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent bg="gray.700">
                                        <PopoverBody
                                            maxH="300px"
                                            overflowY="auto"
                                        >
                                            <RadioGroup value={selectedEndTime}>
                                                <VStack
                                                    align="stretch"
                                                    spacing={2}
                                                >
                                                    {timeSlots.map((slot) => (
                                                        <Radio
                                                            key={slot.hour}
                                                            value={slot.hour}
                                                            isDisabled={
                                                                isTimeSlotReserved(
                                                                    slot.hour
                                                                ) ||
                                                                slot.hour <=
                                                                    selectedStartTime
                                                            }
                                                            onChange={() =>
                                                                handleTimeSelect(
                                                                    slot.hour,
                                                                    false
                                                                )
                                                            }
                                                            colorScheme="red"
                                                        >
                                                            <Text color="white">
                                                                {slot.display}
                                                            </Text>
                                                        </Radio>
                                                    ))}
                                                </VStack>
                                            </RadioGroup>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </HStack>

                            <Grid templateColumns="40% 60%" gap={6}>
                                <GridItem>
                                    <Box
                                        p={4}
                                        borderRadius="md"
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                    >
                                        <VStack spacing={3} align="stretch">
                                            <Flex
                                                justify="space-between"
                                                align="center"
                                            >
                                                <Text
                                                    color="#272643"
                                                    fontWeight="medium"
                                                >
                                                    Selected Range:
                                                </Text>
                                            </Flex>
                                            <Flex
                                                justify="space-between"
                                                align="center"
                                            >
                                                <Text color="#272643">
                                                    Date:{" "}
                                                </Text>
                                                <Text>
                                                    {selectedDate.format(
                                                        "DD.MM.YYYY"
                                                    )}
                                                </Text>
                                            </Flex>
                                            <Flex
                                                justify="space-between"
                                                align="center"
                                            >
                                                <Text color="#272643">
                                                    Time:{" "}
                                                </Text>
                                                <Text>
                                                    {selectedStartTime !==
                                                        null &&
                                                    selectedEndTime !== null
                                                        ? `${dayjs()
                                                              .hour(
                                                                  selectedStartTime
                                                              )
                                                              .format(
                                                                  "hh:mm A"
                                                              )} - ${dayjs()
                                                              .hour(
                                                                  selectedEndTime
                                                              )
                                                              .format(
                                                                  "hh:mm A"
                                                              )}`
                                                        : "N/A"}
                                                </Text>
                                            </Flex>
                                        </VStack>
                                    </Box>
                                </GridItem>
                            </Grid>
                        </VStack>
                    </GridItem>

                    {/* Right Column - Summary and Checkout */}
                    <GridItem>
                        <VStack spacing={4} align="stretch" h="100%">
                            <Box
                                p={4}
                                borderRadius="md"
                                borderWidth="1px"
                                borderColor="gray.200"
                                flex="1"
                            >
                                <VStack spacing={3} align="stretch">
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Text color="#272643">
                                            Total Duration:
                                        </Text>
                                        <Text color="#272643">
                                            {totalDuration} hours
                                        </Text>
                                    </Flex>
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Text color="#272643">Rate:</Text>
                                        <Text color="#272643">
                                            Rs {ratePerHour} per hour
                                        </Text>
                                    </Flex>
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Text color="#272643" fontWeight="bold">
                                            Total Amount:
                                        </Text>
                                        <Text color="#272643" fontWeight="bold">
                                            Rs {totalAmount}
                                        </Text>
                                    </Flex>
                                </VStack>
                            </Box>
                            <Button
                                colorScheme="red"
                                size="lg"
                                width="100%"
                                mt="auto"
                            >
                                Proceed to Checkout
                            </Button>
                        </VStack>
                    </GridItem>
                </Grid>
            </CardBody>
        </Card>
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
        <Container maxW="container.xl" bg="#ffffff" p={8} minH="100vh">
            <VStack spacing={8} align="stretch">
                <Heading size="lg" textAlign="center" color="#272643">
                    Select Date
                </Heading>
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
            </VStack>
        </Container>
    );
};

export default HybridDateTimePicker;
