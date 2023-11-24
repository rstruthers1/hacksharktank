import React from 'react';

export const getErrorMessage = (error) => {
    if (!error?.data?.message) {
        return 'Unknown error';
    }
    if (Array.isArray(error.data.message)) {
        const errorMessages = error.data.message;
        return (
            <ul>
                {errorMessages.map(errorMessage => {
                    return (
                        <li>{errorMessage.msg}</li>
                    );
                })}
            </ul>
        );
    } else {
        return error.data.message;
    }
}