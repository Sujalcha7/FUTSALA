import React from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
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
import NotFound from "./pages/NotFound/notfound.jsx";

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

    // Role-based route access with fallback to NotFound page
    const routeAccess = (role, path) => {
        if (role === "manager") {
            // Manager specific pages
            if (path === "/dashboard" || path === "/employee-create" || path === "/user-list") {
                return true; // Access allowed for manager
            }
        } else if (role === "employee") {
            // Employee specific pages
            if (path === "/employee-tasks-list" || path === "/profile" || path === "/reservations") {
                return true; // Access allowed for employee
            }
        }
        // For customers or unauthorized access
        if (role === "customer" && path !== "/dashboard" && path !== "/employee-create" && path !== "/user-list") {
            return true; // Access allowed for customer on general pages
        }
        return false; // Unauthorized access
    };

    return (
        <Box>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/employees" element={user && routeAccess(user.role, "/employees") ? <EmployeeList /> : <Navigate to="/404-not-found" replace />} />
                <Route path="/employee-create" element={user && routeAccess(user.role, "/employee-create") ? <EmployeeCreation /> : <Navigate to="/404-not-found" replace />} />
                <Route path="/assign-tasks" element={user && routeAccess(user.role, "/assign-tasks") ? <AssignTasks /> : <Navigate to="/404-not-found" replace />} />
                <Route path="/edit-employee" element={user && routeAccess(user.role, "/edit-employee") ? <EditEmployee /> : <Navigate to="/404-not-found" replace />} />
                <Route path="/employee-tasks-list" element={user && routeAccess(user.role, "/employee-tasks-list") ? <EmployeeTasksList /> : <Navigate to="/404-not-found" replace />} />
                <Route path="/reservations" element={user && routeAccess(user.role, "/reservations") ? <Reservations /> : <Navigate to="/404-not-found" replace />} />
                <Route path="/aboutus" element={<AboutUsPage />} />
                <Route path="/contactus" element={<ContactUsPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/user-list" element={user && routeAccess(user.role, "/user-list") ? <UsersList /> : <Navigate to="/404-not-found" replace />} />
                <Route path="/court/:id" element={<CourtPage />} />
                <Route path="/courts/" element={<Courts />} />
                <Route path="/user-reservations" element={<UserReservations />} />
                <Route path="/create-reservation/:id" element={<CreateReservation />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={user && routeAccess(user.role, "/dashboard") ? <SuperuserDashboard /> : <Navigate to="/404-not-found" replace />} />
                {/* Catch-all route for NotFound page */}
                <Route path="/404-not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404-not-found" replace />} /> {/* Redirect all undefined routes */}
            </Routes>
            {!noFooterRoutes.includes(location.pathname) && <Footer />}
        </Box>
    );
}

export default App;
