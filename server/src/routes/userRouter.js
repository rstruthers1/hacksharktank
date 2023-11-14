const express = require('express');
const knex = require('../config/knex')
const userRouter = express.Router();
const bcrypt = require("bcrypt")

const { body, validationResult } = require('express-validator');
const PasswordValidator = require('password-validator');
const jwt = require("jsonwebtoken");


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


userRouter.route('/users/').get(async (request, response, next) => {
    try {
        const users = await knex('user').select('id', 'username', 'email')
        response.json(users);
    } catch (err) {
        next(err)
    }
});

userRouter.route('/users').post(async (req, res, next) => {
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

userRouter.route('/users/login').post(async (req, res, next) => {
    const { email, password } = req.body; // assuming these are passed in the request
    const existingUser = await knex('user')
        .where('email', email)
        .first();

    if (!existingUser) {
        res.status(400).json({ success: false, message: "Invalid email or password." })
        return;
    }

    const passwordIsValid = bcrypt.compareSync(password, existingUser.password, HASH_SALT);

    if (!passwordIsValid) {
        res.status(400).json({ success: false, message: "Invalid email or password." })
        return;
    }

    const userRoles = await knex('user_role')
        .where('userId', existingUser.id)
        .join('role', 'user_role.roleId', 'role.id')
        .select('role.name');

    // create a JWT token
    let JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ id: existingUser.id, roles: userRoles, email: existingUser.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );


    res.json({ success: true, message: "User logged in successfully", token: token });
})

module.exports = userRouter;