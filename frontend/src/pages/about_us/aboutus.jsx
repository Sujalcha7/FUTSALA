import React from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";
import { Container } from "@chakra-ui/react";
// import logo from './logo.png';

const AboutUsPage = () => {
    return (
        <Container maxW="md" mt={10} mb={100}>
            <div>
                <div className="company-card">
                    {/* <div className="logo-column">
                    <img src={logo} alt="Company Logo" className="company-logo" />              
                </div> */}
                    <div className="description-column">
                        <h2>About Us</h2>

                        <p>
                            Welcome to FUTSALA, where the excitement of the game
                            meets the convenience of online reservations.
                        </p>
                        <p>
                            Our platform offers a seamless booking system for
                            futsal enthusiasts, designed to make reserving your
                            favorite futsal court quick and hassle-free. Whether
                            you're a player looking to enjoy a thrilling match
                            with friends or an organizer managing a tournament,
                            FUTSALA provides a user-friendly platform where you
                            can book futsal courts in real-time.
                        </p>
                        <p>
                            With our intuitive interface and dedicated support,
                            you can reserve a futsal court effortlessly, knowing
                            that you're part of a community that values fairness
                            and transparency. Join us at FUTSALA and experience
                            a new way to enjoy your favorite sport without the
                            hassle of traditional bookings.
                        </p>

                        <p>
                            <Link to="/contactus" className="contact-link">
                                Contact us{" "}
                            </Link>{" "}
                            today to learn more about how we can help you
                            achieve your goals!
                        </p>

                        <Link to="/" className="back-button">
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AboutUsPage;
