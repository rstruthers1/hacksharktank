// authUtils.js
export const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    // Check if expired, else return true
    try {
        const {exp} = JSON.parse(atob(token.split('.')[1])); // Decode payload
        const expiration = new Date(exp * 1000); // Convert to milliseconds
        const now = new Date();
        return now < expiration;
    } catch {
        return false; // if there's an error decoding the token, consider it invalid
    }

};

export const getLoggedInUser = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    // Check if expired, else return true
    try {

        const {id, username, email} = JSON.parse(atob(token.split('.')[1])); // Decode payload
        console.log(`id: ${id}, username: ${username}, email: ${email}`)
        return {id, email};
    } catch {
        return null; // if there's an error decoding the token, consider it invalid
    }
}

export const isUserAdmin = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }
    // Check if expired
    let user = null;
    try {
        user = JSON.parse(atob(token.split('.')[1])); // Decode payload
        const expiration = new Date(user.exp * 1000); // Convert to milliseconds
        const now = new Date();
        return now < expiration && user.roles.includes('admin');
    } catch {
        return false; // if there's an error decoding the token, consider it invalid
    }
}

// Returns true if token exists and is expired, else false
export const isSessionExpired = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    // Check if expired, else return true
    try {
        const {exp} = JSON.parse(atob(token.split('.')[1])); // Decode payload
        const expiration = new Date(exp * 1000); // Convert to milliseconds
        const now = new Date();
        return now > expiration;
    } catch {
        return false; // if there's an error decoding the token, consider it invalid
    }
}

export const logoutUser = () => {
    localStorage.removeItem('token');
}
