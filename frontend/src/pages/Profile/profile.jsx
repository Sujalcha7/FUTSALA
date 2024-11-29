import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Button,
    Badge,
} from "@chakra-ui/react";
import axios from "axios";

const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

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

    if (!user) {
        return null;
    }

    return (
        <Container maxW="container.md" mt={10} mb={500}>
            <VStack spacing={6} align="start">
                <Heading>My Profile</Heading>
                <Box>
                    <Text fontSize="lg" fontWeight="bold">
                        Email:
                    </Text>
                    <Text>{user.email}</Text>
                </Box>
                <Box>
                    <Text fontSize="lg" fontWeight="bold">
                        Account Type:
                    </Text>
                    <Badge colorScheme={user.is_superuser ? "green" : "gray"}>
                        {user.is_superuser ? "Superuser" : "Regular User"}
                    </Badge>
                </Box>
                <Button colorScheme="red" onClick={handleLogout}>
                    Logout
                </Button>
            </VStack>
        </Container>
    );
};

export default Profile;
