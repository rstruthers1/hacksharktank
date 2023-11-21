const express = require('express');
const knex = require('../config/knex')
const hackathonRouter = express.Router();
const { body, validationResult, check} = require('express-validator');
const authenticateToken = require("../middleware/auth");
const {convertDateToDBFormat, getTodayAtMidnight} = require("../utils/dateTimeUtils");
const {addHackathonUserRoles} = require("../dao/hackathonUser");
const {getRoleIds} = require("../dao/hackathonRoles");

const validateHackathonInput = [
    body('eventName').isLength({ min: 3}).withMessage('Event name must be at least three characters long').isLength({ max: 256}).withMessage('Event name must be at most 256 characters long'),
    body('description').isLength({ min: 3}).withMessage('Description must be at least three characters long').isLength({ max: 512}).withMessage('Description must be at most 512 characters long'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('startDate').not().isBefore(getTodayAtMidnight().toISOString()).withMessage('Start date must not be in the past'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    check('startDate').toDate().custom((startDate, { req }) => {
        if (startDate.getTime() >= Date.parse(req.body.endDate)) {
            throw new Error('Start date must be before end date');
        }
        return true;
    })
];

hackathonRouter.route('/hackathons').get(authenticateToken, async (req, res, next) => {
    try {
        const authUserRoles = req.user.roles;
        if (!authUserRoles.includes('admin')) {
            res.status(401).json({ success: false, message: "Unauthorized" })
            return;
        }
        const hackathons = await knex('hackathon').select('id', 'eventName', 'description', 'startDate', 'endDate')
        res.json(hackathons);
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
            startDate: convertDateToDBFormat(startDate),
            endDate: convertDateToDBFormat(endDate)
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
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
})

/*
sample payload
{
    "hackathonId": 1,
    "userId": 1,
    "hackathonRoles": ["participant", "admin"]
}
 */

hackathonRouter.route('/hackathons/user').post(authenticateToken, async (req, res) => {
    const {hackathonId, userId, hackathonRoles} = req.body;
    try {
        const authUserRoles = req.user.roles;
        if (!authUserRoles.includes('admin')) {
            res.status(401).json({ success: false, message: "Unauthorized" })
            return;
        }

        if (!hackathonId) {
            res.status(400).json({ success: false, message: "Missing required fields hackathonId" })
            return;
        }

        if (!userId) {
            res.status(400).json({ success: false, message: "Missing required fields userId" })
            return;
        }

        if (!hackathonRoles || hackathonRoles.length === 0) {
            res.status(400).json({ success: false, message: "Missing required fields hackathonRoles" })
            return;
        }

        const roleIds = await getRoleIds(hackathonRoles);
        if (!roleIds) {
            res.status(400).json({ success: false, message: "Role(s) not found" })
            return;
        }

        // Send back which roles were not found
        const roleNames = Object.keys(roleIds);
        const missingRoles = hackathonRoles.filter(role => !roleNames.includes(role));
        if (missingRoles.length > 0) {
            res.status(400).json({ success: false, message: `Hackathon role(s) ${missingRoles.join(', ')} not found` })
            return;
        }

        const newHackathonUserRoles = await addHackathonUserRoles(knex, hackathonId, userId, Object.values(roleIds));
        if (!newHackathonUserRoles) {
            res.status(500).json({ success: false, message: "Error adding user to hackathon" })
            return;
        }
        res.status(200).json({ success: true, message: "User added to hackathon successfully.",
                user: {
                hackathonId,
                userId,
                hackathonRoles
            }});

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
})

module.exports = hackathonRouter;