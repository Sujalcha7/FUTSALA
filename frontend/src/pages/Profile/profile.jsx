import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Reservations from "../../components/Reservations/reservation";
import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    Button,
    Badge,
    Card,
    CardHeader,
    CardBody,
    Container,
    Avatar,
    Input,
} from "@chakra-ui/react";
import axios from "axios";

const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8000/api/logout/",
                {},
                { withCredentials: true }
            );
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setProfilePic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Container maxW="1500" py={8}>
            <Heading mb={6} textAlign="center">
                My Profile
            </Heading>

            <Box bg="gray.50" p={6} borderRadius="lg" shadow="md">
                <Flex justify="center" gap={6}>
                    <Card flex="1">
                        {/* <CardHeader>
                            <Heading size="md">Profile Details: </Heading>
                        </CardHeader> */}
                        <CardBody>
                            {/* <VStack align={"stretch"}> */}
                            <VStack align={"stretch"} spacing={4}>
                                {/* Profile Picture */}
                                <Box textAlign="center">
                                    <Avatar size="xl" src={profilePic} mb={4} />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                        mt={2}
                                    />
                                </Box>
                                <Text fontSize="lg" fontWeight="bold">
                                    Email:
                                </Text>
                                <Text>{user.email}</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                    Account Type:
                                </Text>
                                <Badge
                                    colorScheme={
                                        user.role == "owner" ? "green" : "gray"
                                    }
                                    width={20}
                                >
                                    {user.role == "owner"
                                        ? "Superuser"
                                        : "Regular User"}
                                </Badge>
                                <Button
                                    colorScheme="red"
                                    onClick={handleLogout}
                                    mt={200}
                                >
                                    Logout
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Card 2: Reservations or Superuser Message */}
                    <Card flex="3">
                        {!user.role == "owner" ? (
                            <Reservations />
                        ) : (
                            <Text textAlign="center" mt={6}>
                                You are a superuser
                            </Text>
                        )}
                    </Card>
                </Flex>
            </Box>
        </Container>
    );
};

export default Profile;
