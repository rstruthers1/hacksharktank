const express = require('express');
const knex = require('../config/knex')
const hackathonRouter = express.Router();
const { body, validationResult, check} = require('express-validator');
const authenticateToken = require("../middleware/auth");

const validateHackathonInput = [
    body('eventName').isLength({ min: 3 }).withMessage('Event name must be at least three characters long'),
    body('description').isLength({ min: 3 }).withMessage('Description must be at least three characters long'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('startDate').isAfter(new Date().toISOString()).withMessage('Start date must not be in the past'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    check('startDate').toDate().custom((startDate, { req }) => {
        if (startDate.getTime() >= Date.parse(req.body.endDate)) {
            throw new Error('Start date must be before end date');
        }
        return true;
    })
];

hackathonRouter.route('/hackathons').get(async (request, response, next) => {
    try {
        const hackathons = await knex('hackathon').select('id', 'eventName', 'description', 'startDate', 'endDate')
        response.json(hackathons);
    } catch (err) {
        next(err)
    }
});

/**
Create a new hackathon
Sample payload with time in startDate and endDate:
    {
        "eventName": "Hackathon 1",
        "description": "A hackathon",
        "startDate": "2023-11-16 00:00:00",
        "endDate": "2023-11-17 00:00:00"
    }
*/

hackathonRouter.route('/hackathons').post(authenticateToken, async (req, res) => {
    const { eventName, description, startDate, endDate } = req.body; // assuming these are passed in the request

    try {
        const authUserRoles = req.user.roles;
        if (!authUserRoles.includes('admin')) {
            res.status(401).json({ success: false, message: "Unauthorized" })
            return;
        }

        const existingHackathon = await knex('hackathon')
            .where('eventName', eventName)
            .first();

        if (existingHackathon) {
            res.status(400).json({ success: false, message: "A hackathon with the same name already exists." })
            return;
        }

        // Perform validation after checking uniqueness
        await Promise.all(validateHackathonInput.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, message: errors.array() });
            return;
        }

        const newHackathon = {
            eventName,
            description,
            startDate,
            endDate
        };

        const [hackathonId] = await knex('hackathon').insert(newHackathon);
        console.log(`Hackathon created with ID ${hackathonId}`);
        res.status(200).json({ success: true, message: "Hackathon created successfully.",
                hackathon: {
                id: hackathonId,
                eventName,
                description,
            }});
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
})

module.exports = hackathonRouter;