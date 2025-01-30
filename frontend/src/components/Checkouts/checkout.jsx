import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Container,
  Grid,
  VStack,
  Heading,
  Text,
  RadioGroup,
  useToast,
  Radio,
  Checkbox,
  Button,
  Image,
  HStack,
  Divider,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import khaltiLogo from "../../assets/khalti-logo-icon.jpg";
import { useAuth} from  "./../../AuthContext";

const FutsalCheckout = () => {
  const { user } = useAuth(); // Access user data from AuthContext
  const location = useLocation();
  const [court, setCourt] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { start_date_time, end_date_time, rate, court_id } =
    location.state || {};
  const totalHours = dayjs(end_date_time).diff(dayjs(start_date_time), "hour");
  const subtotal = totalHours * rate;
  const total = subtotal;
  const [formData, setFormData] = useState({
    paymentMethod: "cash",
    termsAccepted: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
  };

  useEffect(() => {
    const fetchCourtDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/courts/${court_id}`,
          {
            withCredentials: true,
          }
        );
        setCourt(response.data);
      } catch (error) {
        toast({
          title: "Error fetching court details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (court_id) {
      fetchCourtDetails();
    }
  }, [court_id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === court.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? court.images.length - 1 : prev - 1
    );
  };

  if (!court) return <Box>Loading...</Box>;

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
      court_id,
    };
    console.log(formData.paymentMethod)
    console.log("cash broo")
    if (formData.paymentMethod === "cash") {
      // Handle Cash Payment (just create reservation)
      try {
        const response = await axios.post(
          "http://localhost:8000/api/create_reservation/",
          payload
        );
        toast({
          title: "Reservation Successful",
          description: "Your reservation has been created successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/profile");
      } catch (error) {
        toast({
          title: "Reservation Failed",
          description:
            "There was an error creating your reservation. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else if (formData.paymentMethod === "khalti") {
      console.log("khalti brooo", user)
      // Handle Khalti Payment
      const khaltiPayload = {
        return_url: "http://localhost:5173/profile",
        website_url: "https://example.com/",
        amount: total,
        purchase_order_id: "Order01", // Unique order ID
        purchase_order_name: court.court_name,
        customer_info: {
          name: user.username,
          email: user.email,
          phone: user.phonenumber,
        },
      };
  
      try {
        const response = await axios.post(
          "https://dev.khalti.com/api/v2/epayment/initiate/",
          khaltiPayload,
          {
            headers: {
              Authorization: "key live_secret_key_68791341fdd94846a146f0457ff7b455",
              "Content-Type": "application/json",
            },
          }
        );
        console.log("khalti-response", response);
        // Handle the response from Khalti API
        if (response.data && response.data.token) {
          // Proceed with redirection to Khalti payment page
          window.location.href = `https://dev.khalti.com/payment/#/checkout/${response.data.token}`;
        }
      } catch (error) {
        toast({
          title: "Payment Failed",
          description: "There was an error processing the payment. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  

  return (
    <Container maxW="7xl" py={10}>
      <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={10}>
        <Box>
          <VStack align="center">
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={prevImage}
              disabled={currentImageIndex === 0}
            >
              Previous
            </Button>
            <Image
              src={court.images[currentImageIndex]}
              alt="Court Image"
              borderRadius="lg"
              boxSize="full"
              objectFit="cover"
            />
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={nextImage}
              disabled={currentImageIndex === court.images.length - 1}
            >
              Next
            </Button>
          </VStack>

          <Box borderWidth="1px" borderRadius="lg" p={6} mt={6}>
            <Heading size="lg" mb={6}>
              Reservation Summary
            </Heading>
            {isLoading ? (
              <Spinner size="xl" />
            ) : (
              <Stack spacing={4}>
                <HStack mb={4} justify="space-between">
                  <Box>
                    <Image
                      src={court?.images[0] || "/futsal-court.jpg"}
                      alt={court?.court_name || "Futsal Court"}
                      boxSize="80px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                  <VStack align="flex-start" flex={1} spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">
                      {court?.court_name || "Court Name"}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Type: {court?.court_type || "Unknown"}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Capacity: {court?.capacity || "Unknown"} players
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {court?.description || "No description available."}
                    </Text>
                  </VStack>
                  <Text fontWeight="bold">Rate: Rs {rate}.00/hr</Text>
                </HStack>
                <Divider my={4} />
                <HStack justify="space-between">
                  <Text>Date</Text>
                  <Text>
                    {new Date(start_date_time).toLocaleDateString()}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Time</Text>
                  <Text>
                    {new Date(start_date_time).toLocaleTimeString()} -{" "}
                    {new Date(end_date_time).toLocaleTimeString()}
                  </Text>
                </HStack>
                <Divider my={4} />
                <HStack justify="space-between">
                  <Text>Subtotal</Text>
                  <Text>Rs {subtotal}.00</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Total</Text>
                  <Text fontWeight="bold">Rs {total}.00</Text>
                </HStack>
              </Stack>
            )}
          </Box>
        </Box>

        <Box>
          <Box borderWidth="1px" borderRadius="lg" p={6}>
            <Heading size="md" mb={4}>
              Payment Information
            </Heading>
            <RadioGroup
              defaultValue="cash"
              onChange={handlePaymentMethodChange}
            >
              <VStack spacing={3} align="stretch" width="100%">
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
                    <Radio value="cash">
                      <Text>Payment with Cash</Text>
                    </Radio>
                  </HStack>
                </Box>
              </VStack>
            </RadioGroup>
            <Checkbox
              mt={4}
              isChecked={formData.termsAccepted}
              onChange={handleCheckboxChange}
            >
              I have read and agree to the website Terms & Conditions
            </Checkbox>
            <Button
              mt={4}
              colorScheme="green"
              size="lg"
              width="100%"
              onClick={handleSubmit}
            >
              PROCEED TO PAYMENT
            </Button>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default FutsalCheckout;