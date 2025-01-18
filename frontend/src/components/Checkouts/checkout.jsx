import React from "react";
import {
    Box,
    Container,
    Grid,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    RadioGroup,
    Radio,
    Select,
    Checkbox,
    Button,
    Image,
    HStack,
    Divider,
    RangeSliderThumb,
} from "@chakra-ui/react";
import esewaLogo from "../../assets/esewa-icon-large.webp";
import khaltiLogo from "../../assets/khalti-logo-icon.jpg";

const FutsalCheckout = () => {
    const reservation = {
        start_date_time: "2024-01-16T19:00:00",
        end_date_time: "2024-01-16T20:00:00",
        rate: 1200,
        reservor_id: 1,
        court_id: 1,
    };

    return (
        <Container maxW="7xl" py={100}>
            <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={10}>
                {/* Left Side - Billing Details */}
                <Box>
                    <Heading size="lg" mb={6}>
                        Billing details
                    </Heading>
                    <VStack spacing={4} align="stretch">
                        <Grid templateColumns="1fr 1fr" gap={4}>
                            <FormControl isRequired>
                                <FormLabel>First name</FormLabel>
                                <Input placeholder="John" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Last name</FormLabel>
                                <Input placeholder="Doe" />
                            </FormControl>
                        </Grid>

                        <Grid templateColumns="1fr 1fr" gap={4}>
                            <FormControl isRequired>
                                <FormLabel>Mobile</FormLabel>
                                <Input placeholder="98XXXXXXXX" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Backup Mobile</FormLabel>
                                <Input placeholder="Optional" />
                            </FormControl>
                        </Grid>

                        <FormControl isRequired>
                            <FormLabel>Address</FormLabel>
                            <Input placeholder="Street address" />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Province</FormLabel>
                            <Select placeholder="Select province">
                                <option>Bagmati Province</option>
                                <option>Province 1</option>
                                <option>Madhesh Province</option>
                                {/* Add other provinces */}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>City</FormLabel>
                            <Select placeholder="Select city">
                                <option>Kathmandu</option>
                                <option>Lalitpur</option>
                                <option>Bhaktapur</option>
                                {/* Add other cities */}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Area</FormLabel>
                            <Select placeholder="Select area">
                                <option>Thamel</option>
                                <option>Balaju</option>
                                <option>Baneshwor</option>
                                {/* Add other areas */}
                            </Select>
                        </FormControl>
                    </VStack>
                </Box>

                {/* Right Side - Order Summary */}
                <Box>
                    <Box borderWidth="1px" borderRadius="lg" p={6}>
                        <Heading size="lg" mb={6}>
                            Reservation summary
                        </Heading>
                        {/* Futsal Details */}
                        <HStack mb={4} justify="space-between">
                            <Box>
                                <Image
                                    src="/futsal-court.jpg"
                                    alt="Futsal Court"
                                    boxSize="80px"
                                    objectFit="cover"
                                    borderRadius="md"
                                />
                            </Box>
                            <VStack align="flex-start" flex={1}>
                                <Text fontWeight="bold">Court A - Indoor</Text>
                                <Text fontSize="sm" color="gray.600">
                                    Date: January 16, 2024
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Time: 7:00 PM - 8:00 PM
                                </Text>
                            </VStack>
                            <Text fontWeight="bold">Rs 1,200.00</Text>
                        </HStack>
                        {/* <Divider my={4} /> */}

                        {/* Note and Coupon */}
                        {/* <Grid templateColumns="1fr 1fr" gap={4} mb={4}>
                            <FormControl>
                                <FormLabel>Note</FormLabel>
                                <Input placeholder="Any special requests?" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Coupon</FormLabel>
                                <Input placeholder="Enter coupon code" />
                            </FormControl>
                        </Grid>{" "} */}

                        <Divider my={4} />
                        {/* Price Summary */}
                        <VStack spacing={2} align="stretch">
                            <HStack justify="space-between">
                                <Text>Subtotal</Text>
                                <Text>Rs 1,200.00</Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontWeight="bold">Total</Text>
                                <Text fontWeight="bold">Rs 1,200.00</Text>
                            </HStack>
                        </VStack>
                        <Divider my={4} />
                        {/* Payment Options */}
                        <Box mb={4}>
                            <Heading size="md" mb={4}>
                                Payment information
                            </Heading>
                            <RadioGroup defaultValue="esewa">
                                <VStack
                                    spacing={3}
                                    align="stretch"
                                    width="100%"
                                >
                                    {/* Khalti */}
                                    <Box
                                        as="label"
                                        borderWidth="1px"
                                        borderRadius="md"
                                        px={4}
                                        py={3}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.50" }}
                                    >
                                        <HStack
                                            justifyContent="space-between"
                                            alignItems="center"
                                            width="100%"
                                        >
                                            <Radio value="khalti">
                                                <Text>Khalti</Text>
                                            </Radio>
                                            <Image
                                                src={khaltiLogo}
                                                h="24px"
                                                alt="Khalti"
                                                objectFit="contain"
                                            />
                                        </HStack>
                                    </Box>

                                    {/* eSewa */}
                                    <Box
                                        as="label"
                                        borderWidth="1px"
                                        borderRadius="md"
                                        px={4}
                                        py={3}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.50" }}
                                    >
                                        <HStack
                                            justifyContent="space-between"
                                            alignItems="center"
                                            width="100%"
                                        >
                                            <Radio value="esewa">
                                                <Text>eSewa</Text>
                                            </Radio>
                                            <Image
                                                src={esewaLogo}
                                                h="24px"
                                                alt="eSewa"
                                                objectFit="contain"
                                            />
                                        </HStack>
                                    </Box>
                                </VStack>
                            </RadioGroup>
                        </Box>
                        {/* Terms and Conditions */}
                        <Checkbox mb={4} isRequired>
                            I have read and agree to the website Terms &
                            Conditions
                        </Checkbox>
                        {/* Submit Button */}
                        <Button colorScheme="green" size="lg" width="100%">
                            PROCEED TO PAYMENT
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Container>
    );
};

export default FutsalCheckout;
