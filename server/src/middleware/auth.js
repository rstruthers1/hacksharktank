const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization')

    if (!authHeader) {
        console.error('Missing auth header')
        return res.status(401).json({success: false, message: "Unauthorized"});
    }

    const authHeaderArray = authHeader.split(' ');

    if (authHeaderArray.length !== 2) {
        console.error(`Invalid auth header: ${authHeader}`);
        return res.status(401).json({success: false, message: "Unauthorized"} );
    }

    const token = authHeaderArray[1];

    if (!token) {
        console.error(`Missing token`);
        return res.status(401).json({success: false, message: "Unauthorized"} );
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        res.status(500).json({success: false, message: "Internal server error. Ask admin to check logs."});
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(`Error verifying token: ${err}`);
            return res.status(403).json({success: false, message: "Forbidden"});
        }

        req.user = user
        next()
    })
}

// Make available to other files
module.exports = authenticateToken;