import React from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; // Import Navigate for redirection
import { useAuth } from "./AuthContext"; // Import useAuth hook
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
import EmployeeTasksList from "./pages/Employees/employeeTasksList";
import EmployeeList from "./pages/Employees/employees";
import CourtPage from "./pages/CourtPage/courtpage";
import Courts from "./pages/Courts/courts";
import AssignTasks from "./pages/Employees/AssignTasks";
import EditEmployee from "./pages/Employees/EditEmployee";
import UsersList from "./pages/userList/userList";
import UserReservations from "./pages/userReservations/userReservations";

function App() {
    const { user, isLoading } = useAuth(); // Access user data from AuthContext

    // Show a loading spinner if the user data is still being fetched
    if (isLoading) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    const location = useLocation();
    const noFooterRoutes = ["/login", "/signup"];

    // Redirect logged-in users from /login and /signup
    if (user && (location.pathname === "/login" || location.pathname === "/signup")) {
        return <Navigate to="/profile" replace />;
    }

    // Redirect logged-out users from other routes (except /login and /signup)
    if (!user && location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/") {
        return <Navigate to="/login" replace />;
    }

    return (
        <Box>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employee-create" element={<EmployeeCreation />} />
                <Route path="/assign-tasks" element={<AssignTasks />} />
                <Route path="/edit-employee" element={<EditEmployee />} />
                <Route path="/employee-tasks-list" element={<EmployeeTasksList />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/aboutus" element={<AboutUsPage />} />
                <Route path="/contactus" element={<ContactUsPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/user-list" element={<UsersList />} />
                <Route path="/court/:id" element={<CourtPage />} />
                <Route path="/courts/" element={<Courts />} />
                <Route path="/user-reservations" element={<UserReservations />} />
                <Route path="/create-reservation/:id" element={<CreateReservation />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<SuperuserDashboard />} />
            </Routes>
            {!noFooterRoutes.includes(location.pathname) && <Footer />}
        </Box>
    );
}

export default App;
