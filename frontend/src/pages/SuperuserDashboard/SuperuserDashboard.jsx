import React, { useState, useEffect } from "react";
import {
    Box,
    VStack,
    Grid,
    Heading,
    Text,
    Spinner,
    Card,
    CardHeader,
    CardBody,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../AuthContext";

const SuperuserDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/dashboard",
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setDashboardData(data);
                setError(null);
            } catch (err) {
                console.error("Dashboard Error:", err);
                setError(err.message);
                setDashboardData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (!user?.role === "owner") {
        return (
            <Box p={8}>
                <Alert status="warning">
                    <AlertIcon />
                    <Text>You do not have permission to view this page.</Text>
                </Alert>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={8}>
                <Alert status="error">
                    <AlertIcon />
                    <Text>Error loading dashboard: {error}</Text>
                </Alert>
            </Box>
        );
    }

    if (!dashboardData) {
        return (
            <Box p={8}>
                <Alert status="error">
                    <AlertIcon />
                    <Text>No dashboard data available.</Text>
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={6}>Superuser Dashboard</Heading>

            <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
                <Card>
                    <CardHeader>
                        <Heading size="md">User Statistics</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stat>
                            <StatLabel>Total Users</StatLabel>
                            <StatNumber>
                                {dashboardData.totalUsers || 0}
                            </StatNumber>
                            <StatHelpText>
                                Active Users: {dashboardData.activeUsers || 0}
                            </StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <Heading size="md">Reservation Overview</Heading>
                    </CardHeader>
                    <CardBody>
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
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <Heading size="md">Revenue Insights</Heading>
                    </CardHeader>
                    <CardBody>
                        <Stat>
                            <StatLabel>Total Revenue</StatLabel>
                            <StatNumber>
                                Rs{" "}
                                {(dashboardData.totalRevenue || 0).toFixed(2)}
                            </StatNumber>
                            <StatHelpText>
                                Month-to-Date: Rs{" "}
                                {(dashboardData.monthRevenue || 0).toFixed(2)}
                            </StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>
            </Grid>

            {dashboardData.reservationTrends?.length > 0 && (
                <Card>
                    <CardHeader>
                        <Heading size="md">Reservation Trends</Heading>
                    </CardHeader>
                    <CardBody>
                        <Box overflowX="auto">
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart
                                    data={dashboardData.reservationTrends}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 40,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                        label={{
                                            value: "Month",
                                            position: "insideBottom",
                                            offset: -10,
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: "No. of Reservations",
                                            angle: -90,
                                            position: "insideLeft",
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value) =>
                                            value.toLocaleString()
                                        }
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line
                                        type="monotone"
                                        dataKey="reservations"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 6 }}
                                        activeDot={{ r: 10 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardBody>
                </Card>
            )}
        </Box>
    );
};

export default SuperuserDashboard;
