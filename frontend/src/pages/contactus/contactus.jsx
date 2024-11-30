import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './contactus.css';
// import logo from './logo.png';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false); // State variable to track form submission status  state initialize

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://formspree.io/f/myyrbrab', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log('Email sent successfully');
                setSubmitted(true); // Update state to indicate successful submission
                setFormData({ name: '', email: '', message: '' }); // Clear form fields
            } else {
                console.error('Error sending email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div>
            <div className='company-card'>
                {/* <div className='logo-column'>
                    <img
                        src={logo}
                        alt='Company Logo'
                        className='company-logo'
                    /> */}
                </div>
                <div className='description-column'>
                    <h2>Contact Us</h2>
                    {!submitted ? ( // Render the form if not submitted
                        <form onSubmit={handleSubmit}>
                            <div className='contact-info'>
                                <p>Name:</p>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='contact-info'>
                                <p>Email:</p>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='contact-info'>
                                <p>Message:</p>
                                <textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type='submit' className='submit-button'>
                                Submit
                            </button>
                        </form>
                    ) : (
                        // Render success message if form submitted successfully
                        <p className='FormSubmittedMessage'>Form Submitted!</p>
                    )}
                    <div className='company-info'>
                        <h3>Our Contact Information</h3>
                        <p>
                            Email:{' '}
                            <a href='mailto:kadelsubekshya@gmail.com'>
                                kadelsubekshya@gmail.com
                            </a>
                        </p>
                        <p>
                            Phone:{' '}
                            <a href='tel:+1234567890'>+1 (234) 567-890</a>
                        </p>
                        {/* Add your company address, social media links, etc. here */}
                    </div>
                    <div>
                        <Link to='/' className='back-button'>
                            Back to home
                        </Link>
                        `
                    </div>
                </div>
            </div>
        // </div>
    );
};

export default ContactUsPage;
