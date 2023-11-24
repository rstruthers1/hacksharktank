const express = require('express');
const knex = require('../config/knex')
const userRouter = express.Router();
const bcrypt = require("bcrypt")

const { body, validationResult } = require('express-validator');
const PasswordValidator = require('password-validator');
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth");



// Create a schema for password validation
const passwordSchema = new PasswordValidator();
const HASH_SALT = 8;
passwordSchema
    .is().min(8)                               // Minimum length 8
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces();                         // Should not have spaces


// Middleware for validation
const validateUserInput = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').custom(value => {
        if (!passwordSchema.validate(value)) {
            throw new Error('Password does not meet complexity requirements.');
        }
        return true;
    })
];


userRouter.route('/users').get(async (request, response, next) => {
    try {
        const users = await knex('user').select('id', 'username', 'email')
        response.json(users);
    } catch (err) {
        next(err)
    }
});


userRouter.route('/users/search').get(async (request, response, next) => {
    try {
        const searchTerm = request.query.searchTerm;
        const users = await knex('user').select('id', 'username', 'email')
            .where('email', 'like', `%${searchTerm}%`)
        response.json(users);
    } catch (err) {
        next(err)
    }
});

userRouter.route('/users').post(async (req, res) => {
    const { email, password, roles } = req.body; // assuming these are passed in the request

    try {

        const existingUser = await knex('user')
            .where('email', email)
            .first();

        if (existingUser) {
            res.status(400).json({ success: false, message: "A user with the same email already exists." })
            return;
        }

        // Perform validation after checking uniqueness
        await Promise.all(validateUserInput.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get role IDs for the given role names
        const roleIds = await knex('role').whereIn('name', roles).select('id');

        if (roleIds.length !== roles.length) {
            res.status(400).json({ success: false, message: "One or more roles are invalid." });
            return;
        }
        let newUserId;
        await knex.transaction(async trx => {
            const [userId] = await trx('user').insert({
                username: email,
                email,
                password: bcrypt.hashSync(password, HASH_SALT)
            });

            const userRoles = roleIds.map(roleId => ({
                userId,
                roleId: roleId.id
            }));


            newUserId = userId;
            await trx('user_role').insert(userRoles);
        });
        const newUser = await knex('user')
            .where('id', newUserId)
            .first();
        res.json({ success: true, message: "User and roles added successfully", user: {
            id: newUser.id,
                username: newUser.username,
                email: newUser.email
            } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating user", error: error });
    }
})

userRouter.route('/users/login').post( async (req, res) => {
    try {
        const {email, password} = req.body;

        const existingUser = await knex('user')
            .where('email', email)
            .first();

        if (!existingUser) {
            res.status(400).json({success: false, message: "Invalid email or password."})
            return;
        }

        const passwordIsValid = bcrypt.compareSync(password, existingUser.password, HASH_SALT);

        if (!passwordIsValid) {
            res.status(400).json({success: false, message: "Invalid email or password."})
            return;
        }

        const userRoles = await knex('user_role')
            .where('userId', existingUser.id)
            .join('role', 'user_role.roleId', 'role.id')
            .select('role.name');

        // create a JWT token
        let JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            res.status(500).json({success: false, message: "Error logging in user"});
            return;
        }
        const userRoleNames = userRoles.map(userRole => userRole.name);
        const token = jwt.sign({id: existingUser.id, roles: userRoleNames, email: existingUser.email},
            JWT_SECRET,
            {expiresIn: '1h'}
        );
        res.json({success: true, message: "User logged in successfully", token: token});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Error logging in user", error: error});
    }
})


userRouter.route('/users/reset-password').post(authenticateToken, async (req, res) => {

    try {

        const authUserRoles = req.user.roles;
        if (!authUserRoles.includes('admin')) {
            res.status(401).json({ success: false, message: "Unauthorized" })
            return;
        }
        const {email, password} = req.body; // assuming these are passed in the request
        const existingUser = await knex('user')
            .where('email', email)
            .first();
        if (!existingUser) {
            res.status(400).json({success: false, message: "User does not exist"})
            return;
        }

        if (!passwordSchema.validate(password)) {
            res.status(400).json({success: false, message: "Password does not meet complexity requirements."})
            return;
        }

        await knex('user')
            .where('email', email)
            .update({password: bcrypt.hashSync(password, HASH_SALT)});
        res.json({success: true, message: "Password reset successfully"});

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Error resetting password", error: error});
    }
})

module.exports = userRouter;