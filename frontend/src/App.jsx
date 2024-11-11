// App.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Home from "./pages/Home/home";
import Signup from "./pages/Signup/signup";
import Login from "./pages/Login/login";
import Reservations from "./pages/Reservations/reservation";
import CreateReservation from "./pages/CreateReservation/create_reservation";
import AboutUsPage from "./pages/about_us/aboutus";
import ContactUsPage from "./pages/contactus/contactus";

function App() {
    return (
        <Box>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/aboutus" element={<AboutUsPage />} />
                <Route path="/contactus" element={<ContactUsPage />} />
                <Route
                    path="/create-reservation"
                    element={<CreateReservation />}
                />
            </Routes>
        </Box>
    );
}

export default App;
