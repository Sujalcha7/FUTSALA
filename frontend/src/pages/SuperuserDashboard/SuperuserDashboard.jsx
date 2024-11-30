import React, { useState, useEffect } from "react";
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Grid,
    Card,
    CardHeader,
    CardBody,
    Spinner,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

// Define the API URL from Vite's environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const SuperuserDashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/superuser/dashboard`
                );
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.is_superuser) {
            fetchDashboardData();
        }
    }, [user]);

    if (!user?.is_superuser) {
        return (
            <Box p={8}>
                <Heading>Access Denied</Heading>
                <Text>You do not have permission to view this page.</Text>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!dashboardData) {
        return (
            <Box p={8}>
                <Heading>Error</Heading>
                <Text>Failed to load dashboard data.</Text>
            </Box>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={6}>Superuser Dashboard</Heading>

            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <Card>
                    <CardHeader>
                        <Heading size="md">User Statistics</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack align="stretch">
                            <Stat>
                                <StatLabel>Total Users</StatLabel>
                                <StatNumber>
                                    {dashboardData.totalUsers || 0}
                                </StatNumber>
                                <StatHelpText>
                                    Active Users:{" "}
                                    {dashboardData.activeUsers || 0}
                                </StatHelpText>
                            </Stat>
                        </VStack>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <Heading size="md">Reservation Overview</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack align="stretch">
                            <Stat>
                                <StatLabel>Total Reservations</StatLabel>
                                <StatNumber>
                                    {dashboardData.totalReservations || 0}
                                </StatNumber>
                                <StatHelpText>
                                    This Month:{" "}
                                    {dashboardData.monthReservations || 0}
                                </StatHelpText>
                            </Stat>
                        </VStack>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <Heading size="md">Revenue Insights</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack align="stretch">
                            <Stat>
                                <StatLabel>Total Revenue</StatLabel>
                                <StatNumber>
                                    $
                                    {dashboardData.totalRevenue?.toFixed(2) ||
                                        0}
                                </StatNumber>
                                <StatHelpText>
                                    Month-to-Date: $
                                    {dashboardData.monthRevenue?.toFixed(2) ||
                                        0}
                                </StatHelpText>
                            </Stat>
                        </VStack>
                    </CardBody>
                </Card>
            </Grid>

            {dashboardData.reservationTrends?.length > 0 ? (
                <Card mt={6}>
                    <CardHeader>
                        <Heading size="md">Reservation Trends</Heading>
                    </CardHeader>
                    <CardBody>
                        <LineChart
                            width={1000}
                            height={300}
                            data={dashboardData.reservationTrends}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="reservations"
                                stroke="#8884d8"
                            />
                        </LineChart>
                    </CardBody>
                </Card>
            ) : (
                <Text>No reservation trends data available.</Text>
            )}
        </Box>
    );
};

export default SuperuserDashboard;
