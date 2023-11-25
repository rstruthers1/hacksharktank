const express = require('express');
const knex = require('../config/knex')
const hackathonRoleRouter = express.Router();

hackathonRoleRouter.route('/hackathon-roles').get(async (req, res, next) => {
    try {
        const hackathonRoles = await knex('hackathon_role').select('*');
        res.status(200).json(hackathonRoles);
    } catch (err) {
        next(err)
    }
});

module.exports = hackathonRoleRouter;

