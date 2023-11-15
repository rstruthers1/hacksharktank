// utils.js
export const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    // Optionally check for token expiry if your JWT contains an expiry claim
    try {
        const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode payload
        const expiration = new Date(exp * 1000); // Convert to milliseconds
        const now = new Date();
        return now < expiration;
    } catch {
        return false; // if there's an error decoding the token, consider it invalid
    }
};
