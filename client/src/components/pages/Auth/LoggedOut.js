// LoggedOut.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LoggedOut.css';

const LoggedOut = () => {
    return (
        <div className="loggedOutContainer">
            <h1>You Have Been Logged Out</h1>
            <p>Thank you for using our application.</p>
            <div>
                <Link to="/login" className="loginAgainButton">Login Again</Link>
                <Link to="/" className="homeButton">Return to Home</Link>
            </div>
        </div>
    );
};

export default LoggedOut;
