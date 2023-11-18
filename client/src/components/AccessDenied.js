import React from 'react';
import './AccessDenied.css';

const AccessDenied = () => {
    return (
        <div className="access-denied-container">
            <h1>403 - Access Denied</h1>
            <p>Sorry, you do not have permission to access this page.</p>
            <a href="/">Return to Home</a>
        </div>
    );
};

export default AccessDenied;
