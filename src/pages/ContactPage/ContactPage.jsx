import React, { useState } from 'react';

import './ContactPage.css';
import { sendContactMessage } from '../../utils/api';
import Toast from '../../components/Toast.jsx/Toast';
import AuthModal from '../../components/AuthModal/AuthModal';
const ContactPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('success');
    const [toastMessage, setToastMessage] = useState('');
    const closeModal = () => setIsOpen(false);


    const [error, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitted(false);
        setError('');

        const userId = localStorage.getItem('userId'); // Assuming userId is stored in local storage

        if (!userId) {
            setIsOpen(true);
            return;
        }
        const data = {
            userId: userId || '', // If userId exists in local storage
            subject: subject,
            message: message
        };

        try {
            const res = await sendContactMessage(data);
            console.log(res);

                setShowToast(true);
                setToastType('success');
                setToastMessage(res.message);
            setIsSubmitted(true);
            setSubject('');
            setMessage('');
        } catch (err) {
            
            setError(err.response.data);
        }
    };


    return (
        <div className="contact-container">
            <h1 className="contact-heading">Contact Us</h1>
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                {error.subject && <p className="error">{error.subject}</p>}
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                                    {error.message && <p className="error">{error.message}</p>}
                </div>
                <button type="submit" className="submit-button">Submit</button>
            </form>

            {showToast && (
                <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
            )}
            <AuthModal isOpen={isOpen} onClose={closeModal} />

        </div>
    );
};

export default ContactPage;
