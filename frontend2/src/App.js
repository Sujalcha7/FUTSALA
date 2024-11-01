import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserList } from "./components/UserComponents";
import { UserRegistration } from "./components/UserComponents";
import { ReservationList } from "./components/ReservationComponents";
import { CreateReservation } from "./components/ReservationComponents";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">
                    Reservation System
                  </span>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                  <Link
                    to="/"
                    className="py-4 px-2 text-gray-500 hover:text-green-500"
                  >
                    Home
                  </Link>
                  <Link
                    to="/users"
                    className="py-4 px-2 text-gray-500 hover:text-green-500"
                  >
                    Users
                  </Link>
                  <Link
                    to="/register"
                    className="py-4 px-2 text-gray-500 hover:text-green-500"
                  >
                    Register
                  </Link>
                  <Link
                    to="/reservations"
                    className="py-4 px-2 text-gray-500 hover:text-green-500"
                  >
                    Reservations
                  </Link>
                  <Link
                    to="/create-reservation"
                    className="py-4 px-2 text-gray-500 hover:text-green-500"
                  >
                    New Reservation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/reservations" element={<ReservationList />} />
            <Route path="/create-reservation" element={<CreateReservation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to the Reservation System
      </h1>
      <p className="text-gray-600">
        Please use the navigation above to manage users and reservations.
      </p>
    </div>
  );
}

export default App;
