const express = require('express');
const knex = require('../config/knex')
const userRouter = express.Router();

userRouter.route('/users/').get(async (request, response, next) => {
    try {
        const users = await knex('user').select('id', 'username', 'email')
        response.json(users);
    } catch (err) {
        next(err)
    }
});

module.exports = userRouter;