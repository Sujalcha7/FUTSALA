import React from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/home";
import Signup from "./pages/Signup/signup";
import Login from "./pages/Login/login";
import Reservations from "./components/Reservations/reservation";
import CreateReservation from "./pages/CreateReservation/create_reservation";
import Profile from "./pages/Profile/profile";
import AboutUsPage from "./pages/about_us/aboutus";
import ContactUsPage from "./pages/contactus/contactus";
import SuperuserDashboard from "./pages/SuperuserDashboard/SuperuserDashboard";
import Checkout from "./components/Checkouts/checkout";

function App() {
    // const { isLoading, user } = useAuth();

    // if (isLoading) {
    //     return (
    //         <Center height="100vh">
    //             <Spinner size="xl" />
    //         </Center>
    //     );
    // }
    // if (!user && !user?.role == "owner") {
    //     return (
    //         <Box>
    //             <Navbar />
    //             <Routes>
    //                 <Route path="/" element={<Home />} />
    //                 <Route path="/signup" element={<Signup />} />
    //                 <Route path="/login" element={<Login />} />
    //                 {/* <Route path="/reservations" element={<Reservations />} /> */}
    //                 <Route path="/aboutus" element={<AboutUsPage />} />
    //                 <Route path="/contactus" element={<ContactUsPage />} />
    //                 <Route
    //                     path="/create-reservation"
    //                     element={<CreateReservation />}
    //                 />
    //                 <Route path="/profile" element={<Profile />} />
    //                 <Route
    //                     path="/superuser-dashboard"
    //                     element={<SuperuserDashboard />}
    //                 />
    //             </Routes>
    //             {/* <Footer /> */}
    //         </Box>
    //     );
    // } else if (user && !user?.role == "owner") {
    //     return (
    //         <Box>
    //             <Navbar />
    //             <Routes>
    //                 <Route path="/" element={<Home />} />
    //                 <Route path="/signup" element={<Signup />} />
    //                 <Route path="/login" element={<Login />} />
    //                 <Route path="/aboutus" element={<AboutUsPage />} />
    //                 <Route path="/contactus" element={<ContactUsPage />} />
    //                 <Route
    //                     path="/create-reservation"
    //                     element={<CreateReservation />}
    //                 />
    //                 <Route path="/profile" element={<Profile />} />
    //                 <Route
    //                     path="/superuser-dashboard"
    //                     element={<SuperuserDashboard />}
    //                 />
    //             </Routes>
    //             <Footer />
    //         </Box>
    //     );
    // } else if (user && user?.role == "owner") {
    //     return (
    //         <Box>
    //             <Navbar />
    //             <Routes>
    //                 <Route path="/" element={<Home />} />
    //                 <Route path="/signup" element={<Signup />} />
    //                 <Route path="/login" element={<Login />} />
    //                 <Route path="/reservations" element={<Reservations />} />
    //                 <Route path="/aboutus" element={<AboutUsPage />} />
    //                 <Route path="/contactus" element={<ContactUsPage />} />
    //                 <Route
    //                     path="/create-reservation"
    //                     element={<CreateReservation />}
    //                 />
    //                 <Route path="/profile" element={<Profile />} />
    //                 <Route
    //                     path="/superuser-dashboard"
    //                     element={<SuperuserDashboard />}
    //                 />
    //             </Routes>
    //         </Box>
    //     );
    // }
    const location = useLocation();
    const noFooterRoutes = ["/login", "/signup"];

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
                <Route path="/checkout" element={<Checkout />} />
                <Route
                    path="/create-reservation"
                    element={<CreateReservation />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<SuperuserDashboard />} />
            </Routes>
            {!noFooterRoutes.includes(location.pathname) && <Footer />}
        </Box>
    );
}

export default App;
