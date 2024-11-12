import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Button,
} from "@chakra-ui/react";
import axios from "axios";

const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

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
        navigate("/login");
        return null;
    }

    return (
        <Container maxW="container.md" mt={10}>
            <VStack spacing={6} align="start">
                <Heading>My Profile</Heading>
                <Box>
                    <Text fontSize="lg" fontWeight="bold">
                        Email:
                    </Text>
                    <Text>{user.email}</Text>
                </Box>
                <Button colorScheme="red" onClick={handleLogout}>
                    Logout
                </Button>
            </VStack>
        </Container>
    );
};

export default Profile;
