import React from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // Add this import
import Navbar from "./components/Navbar/navbar";
import Home from "./pages/Home/home";
import Signup from "./pages/Signup/signup";
import Login from "./pages/Login/login";
import Reservations from "./pages/Reservations/reservation";
import CreateReservation from "./pages/CreateReservation/create_reservation";
import Profile from "./pages/Profile/profile"; // Add this import

function App() {
    return (
        <AuthProvider>
            {/* {" "} */}
            {/* Wrap everything in AuthProvider */}
            <Box>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route
                        path="/create-reservation"
                        element={<CreateReservation />}
                    />
                    <Route path="/profile" element={<Profile />} />{" "}
                    {/* Add this route */}
                </Routes>
            </Box>
        </AuthProvider>
    );
}

export default App;
