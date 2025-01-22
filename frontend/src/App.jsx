import React from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/home";
import Signup from "./pages/Signup/signup";
import Login from "./pages/Login/login";
import EmployeeCreation from "./pages/EmployeeCreate/employee_create";
import Reservations from "./pages/All_reservations/All_reservations";
import CreateReservation from "./pages/CreateReservation/create_reservation";
import Profile from "./pages/Profile/profile";
import AboutUsPage from "./pages/about_us/aboutus";
import ContactUsPage from "./pages/contactus/contactus";
import SuperuserDashboard from "./pages/SuperuserDashboard/SuperuserDashboard";
import Checkout from "./components/Checkouts/checkout";
import EmployeeList from "./pages/Employees/employees";
import CourtPage from "./pages/CourtPage/courtpage";

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
                <Route path="/employee-create" element={<EmployeeCreation />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/aboutus" element={<AboutUsPage />} />
                <Route path="/contactus" element={<ContactUsPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/courtpage/:id" element={<CourtPage />} />
                <Route
                    path="/create-reservation/:id"
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
