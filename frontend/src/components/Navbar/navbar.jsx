import React, { useEffect } from "react";
import {
    useToast,
    Button,
    Box,
    Flex,
    Link as ChakraLink,
    Text,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaTachometerAlt,
    FaUsers,
    FaClipboardList,
    FaListAlt,
    FaCalendarPlus,
    FaInfoCircle,
    FaUserCircle,
    FaUserPlus,
    FaSignInAlt,
    FaSignOutAlt,
    FaCaretDown,
    FaBasketballBall,
} from "react-icons/fa";

function Navbar() {
    const { user, setUser, isLoading, getUser } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        getUser();
    }, [getUser]);

    useEffect(() => {
        if (!isLoading && !user) {
            console.log("User is not logged in");
        }
    }, [isLoading, user]);

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
            toast({
                title: "Logout failed",
                description:
                    error.response?.data?.detail ||
                    "An error occurred during logout",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1rem"
            bg="white.800"
            color="black"
        >
            {/* Brand Logo */}
            <Flex align="center" mr={5}>
                <ChakraLink
                    as={RouterLink}
                    to="/"
                    fontWeight="bold"
                    fontSize="lg"
                >
                    FUTSALA
                </ChakraLink>
            </Flex>

            {/* Navigation Links */}
            <Flex align="center">
                {user ? (
                    user.role === "manager" ? (
                        // Manager Links with Dropdown for Username
                        <Flex align="center" gap={3}>
                            <ChakraLink
                                as={RouterLink}
                                to="/dashboard"
                                mr={3}
                                _hover={{ color: "blue.500" }}
                            >
                                <Icon as={FaTachometerAlt} mr={2} />
                                Dashboard
                            </ChakraLink>
                            <ChakraLink
                                as={RouterLink}
                                to="/court/create"
                                mr={3}
                                _hover={{ color: "blue.500" }}
                            >
                                <Icon as={FaBasketballBall} mr={2} />
                                Create Court
                            </ChakraLink>
                            <ChakraLink
                                as={RouterLink}
                                to="/employees"
                                mr={3}
                                _hover={{ color: "blue.500" }}
                            >
                                <Icon as={FaUsers} mr={2} />
                                Employees
                            </ChakraLink>
                            <ChakraLink
                                as={RouterLink}
                                to="/reservations"
                                mr={3}
                                _hover={{ color: "blue.500" }}
                            >
                                <Icon as={FaClipboardList} mr={2} />
                                Reservations
                            </ChakraLink>
                            <ChakraLink
                                as={RouterLink}
                                to="/user-list"
                                mr={3}
                                _hover={{ color: "blue.500" }}
                            >
                                <Icon as={FaListAlt} mr={2} />
                                User List
                            </ChakraLink>
                            {/* Username Dropdown */}
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<FaCaretDown />}
                                >
                                    <Flex align="center">
                                        <Icon as={FaUserCircle} mr={2} />
                                        <Text fontSize="md" fontWeight="medium">
                                            Welcome, {user.username}!
                                        </Text>
                                    </Flex>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        as={RouterLink}
                                        to="/profile"
                                        _hover={{ color: "blue.500" }}
                                    >
                                        <Icon as={FaUserCircle} mr={2} />
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleLogout}
                                        _hover={{ color: "red.500" }}
                                    >
                                        <Icon as={FaSignOutAlt} mr={2} />
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                    ) : (
                        // Normal User Links
                        <Flex align="center" gap={3}>
                            <ChakraLink
                                as={RouterLink}
                                to="/courts"
                                mr={3}
                                _hover={{ color: "blue.500" }}
                            >
                                <Icon as={FaCalendarPlus} mr={2} />
                                Create Reservation
                            </ChakraLink>
                            <ChakraLink
                                as={RouterLink}
                                to="/aboutus"
                                mr={3}
                                _hover={{ color: "blue.500" }}
                            >
                                <Icon as={FaInfoCircle} mr={2} />
                                About Us
                            </ChakraLink>
                            {/* Username Dropdown for Normal Users */}
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<FaCaretDown />}
                                >
                                    <Flex align="center">
                                        <Icon as={FaUserCircle} mr={2} />
                                        <Text fontSize="md" fontWeight="medium">
                                            Welcome, {user.username}!
                                        </Text>
                                    </Flex>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        as={RouterLink}
                                        to="/profile"
                                        _hover={{ color: "blue.500" }}
                                    >
                                        <Icon as={FaUserCircle} mr={2} />
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleLogout}
                                        _hover={{ color: "red.500" }}
                                    >
                                        <Icon as={FaSignOutAlt} mr={2} />
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                    )
                ) : (
                    // Unauthenticated User Links
                    <Flex align="center" gap={3}>
                        <ChakraLink
                            as={RouterLink}
                            to="/signup"
                            mr={3}
                            _hover={{ color: "blue.500" }}
                        >
                            <Icon as={FaUserPlus} mr={2} />
                            Signup
                        </ChakraLink>
                        <ChakraLink
                            as={RouterLink}
                            to="/login"
                            mr={3}
                            _hover={{ color: "blue.500" }}
                        >
                            <Icon as={FaSignInAlt} mr={2} />
                            Login
                        </ChakraLink>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}

export default Navbar;
