import React, { useState } from "react";
import dayjs from "dayjs";
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
    useToast,
    Radio,
    Select,
    Checkbox,
    Button,
    Image,
    HStack,
    Divider,
    RangeSliderThumb,
} from "@chakra-ui/react";
import { useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import esewaLogo from "../../assets/esewa-icon-large.webp";
import khaltiLogo from "../../assets/khalti-logo-icon.jpg";

const FutsalCheckout = () => {
    const location = useLocation();
    const toast = useToast();
    const navigate = useNavigate();
    const { start_date_time, end_date_time, rate } = location.state || {};
    const totalHours = dayjs(end_date_time).diff(dayjs(start_date_time), 'hour');
    const subtotal = totalHours * rate;
    const total = subtotal; 
    const [formData, setFormData] = useState({
        paymentMethod: "esewa",
        termsAccepted: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePaymentMethodChange = (value) => {
        setFormData((prev) => ({ ...prev, paymentMethod: value }));
    };

    const handleCheckboxChange = (e) => {
        setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
    };

    const handleSubmit = async () => {
        if (!formData.termsAccepted) {
            toast({
                title: "Terms and Conditions",
                description: "You must accept the terms and conditions to proceed.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const payload = {
            start_date_time,
            end_date_time,
            rate,
        };

        try {
            const response = await axios.post("http://localhost:8000/api/create_reservation/", payload);
            console.log("Reservation successful:", response.data);
            toast({
                title: "Reservation Successful",
                description: "Your reservation has been created successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
          navigate("/profile");
        } catch (error) {
            console.error("Error creating reservation:", error);
            toast({
                title: "Reservation Failed",
                description: "There was an error creating your reservation. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="7xl" py={100}>
            <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={10}>
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
                                    Date: {new Date(start_date_time).toLocaleDateString()}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Time: {new Date(start_date_time).toLocaleTimeString()} - {new Date(end_date_time).toLocaleTimeString()}
                                </Text>
                            </VStack>
                            <Text fontWeight="bold">Rate: Rs {rate}.00</Text>
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
                                <Text>Rs {subtotal}.00</Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontWeight="bold">Total</Text>
                                <Text fontWeight="bold">Rs {total}.00</Text>
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
                        <Checkbox
                            mb={4}
                            isRequired
                            isChecked={formData.termsAccepted}
                            onChange={handleCheckboxChange}
                        >
                            I have read and agree to the website Terms & Conditions
                        </Checkbox>
                        <Button colorScheme="green" size="lg" width="100%" onClick={handleSubmit}>
                            PROCEED TO PAYMENT
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Container>
    );
};

export default FutsalCheckout;
