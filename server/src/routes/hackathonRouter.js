const express = require('express');
const knex = require('../config/knex')
const hackathonRouter = express.Router();
const {body, validationResult, check} = require('express-validator');
const authenticateToken = require("../middleware/auth");
const {convertDateToDBFormat, getTodayAtMidnight} = require("../utils/dateTimeUtils");
const {addHackathonUserRoles} = require("../dao/hackathonUser");
const {getRoleIds} = require("../dao/hackathonRoles");
const {userIsSiteAdminOrHackathonMember, userIsSiteAdminOrHasHackathonRole} = require("../utils/authUtils");

const validateHackathonInput = [
    body('eventName').isLength({min: 3}).withMessage('Event name must be at least three characters long').isLength({max: 256}).withMessage('Event name must be at most 256 characters long'),
    body('description').isLength({min: 3}).withMessage('Description must be at least three characters long').isLength({max: 512}).withMessage('Description must be at most 512 characters long'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('startDate').not().isBefore(getTodayAtMidnight().toISOString()).withMessage('Start date must not be in the past'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    check('startDate').toDate().custom((startDate, {req}) => {
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
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        const hackathons = await knex('hackathon').select('id', 'eventName', 'description', 'startDate', 'endDate')
        res.json(hackathons);
    } catch (err) {
        next(err)
    }
});

hackathonRouter.route('/hackathons/users/:userId').get(authenticateToken, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (req.user.id !== parseInt(userId)) {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        const hackathons = await knex('hackathon')
            .join('hackathon_user', 'hackathon.id', '=', 'hackathon_user.hackathonId')
            .join('user', 'hackathon_user.userId', '=', 'user.id')
            .leftJoin('hackathon_user_role', 'hackathon_user.id', '=', 'hackathon_user_role.hackathonUserId')
            .leftJoin('hackathon_role', 'hackathon_user_role.hackathonRoleId', '=', 'hackathon_role.id')
            .select('hackathon.id','hackathon.eventName', 'hackathon.description', 'hackathon.startDate',
                'hackathon.endDate', 'hackathon_role.name as hackathonUserRoleName')
            .where('user.id', userId);
        const hackathonsWithUserRoleLists = hackathons.reduce((acc, hackathon) => {
            const hackathonWithUserRoleList = acc.find(h => h.id === hackathon.id);
            if (hackathonWithUserRoleList && hackathon.hackathonUserRoleName) {
                hackathonWithUserRoleList.hackathonUserRoles.push(hackathon.hackathonUserRoleName);
            } else {
                const hackathonUserRoles = [];
                if (hackathon.hackathonUserRoleName) {
                    hackathonUserRoles.push(hackathon.hackathonUserRoleName);
                }
                acc.push({id: hackathon.id, eventName: hackathon.eventName, description: hackathon.description,
                    startDate: hackathon.startDate, endDate: hackathon.endDate, hackathonUserRoles: hackathonUserRoles});
            }
            return acc;
        }
        , []);

        res.json(hackathonsWithUserRoleLists);
    } catch (err) {
        next(err)
    }
});

hackathonRouter.route('/hackathons/:hackathonId/users/:userId').get(authenticateToken, async (req, res, next) => {
    try {
        const hackathonId = req.params.hackathonId;
        const authorized = await userIsSiteAdminOrHackathonMember(req, hackathonId);
        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        const userId = req.params.userId;
        const hackathon = await knex('hackathon')
            .join('hackathon_user', 'hackathon.id', '=', 'hackathon_user.hackathonId')
            .join('user', 'hackathon_user.userId', '=', 'user.id')
            .leftJoin('hackathon_user_role', 'hackathon_user.id', '=', 'hackathon_user_role.hackathonUserId')
            .leftJoin('hackathon_role', 'hackathon_user_role.hackathonRoleId', '=', 'hackathon_role.id')
            .select('hackathon.id','hackathon.eventName', 'hackathon.description', 'hackathon.startDate',
                'hackathon.endDate', 'hackathon_role.name as hackathonUserRoleName')
            .where('hackathon.id', hackathonId)
            .where('user.id', userId);
        if (!hackathon) {
            res.status(404).json({success: false, message: "Hackathon not found"})
            return;
        }
        const hackathonWithUserRoleList = hackathon.reduce((acc, hackathon) => {
            if (hackathon.hackathonUserRoleName) {
                acc.hackathonUserRoles.push(hackathon.hackathonUserRoleName);
            }
            return acc;
        }
        , {id: hackathon[0].id, eventName: hackathon[0].eventName, description: hackathon[0].description,
            startDate: hackathon[0].startDate, endDate: hackathon[0].endDate, hackathonUserRoles: []});

        res.json(hackathonWithUserRoleList);
    } catch (err) {
        next(err)
    }

});

hackathonRouter.route('/hackathons/:id').get(authenticateToken, async (req, res, next) => {
    try {
        const authorized = await userIsSiteAdminOrHackathonMember(req, req.params.id);
        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        const hackathon = await knex('hackathon')
            .where('id', req.params.id)
            .first();
        if (!hackathon) {
            res.status(404).json({success: false, message: "Hackathon not found"})
            return;
        }
        res.json(hackathon);
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
    const {eventName, description, startDate, endDate} = req.body; // assuming these are passed in the request
    try {
        const authUserRoles = req.user.roles;
        if (!authUserRoles.includes('admin')) {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }

        const existingHackathon = await knex('hackathon')
            .where('eventName', eventName)
            .first();

        if (existingHackathon) {
            res.status(400).json({success: false, message: "A hackathon with the same name already exists."})
            return;
        }

        // Perform validation after checking uniqueness
        await Promise.all(validateHackathonInput.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({success: false, message: errors.array()});
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
        res.status(200).json({
            success: true, message: "Hackathon created successfully.",
            hackathon: {
                id: hackathonId,
                eventName,
                description,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: err.message});
    }
})

hackathonRouter.route('/hackathons/:id').put(authenticateToken, async (req, res) => {
    const {eventName, description, startDate, endDate} = req.body;
    try {
        const hackathonId = req.params.id;
        const authorized = await userIsSiteAdminOrHasHackathonRole(req, hackathonId, ['admin']);
        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }

        const existingHackathon = await knex('hackathon')
            .where('id', req.params.id)
            .first();

        if (!existingHackathon) {
            res.status(404).json({success: false, message: "Hackathon not found"})
            return;
        }

        // Perform validation after checking uniqueness
        await Promise.all(validateHackathonInput.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({success: false, message: errors.array()});
            return;
        }

        const updatedHackathon = {
            eventName,
            description,
            startDate: convertDateToDBFormat(startDate),
            endDate: convertDateToDBFormat(endDate)
        };

        await knex('hackathon')
            .where('id', hackathonId)
            .update(updatedHackathon);
        res.status(200).json({
            success: true, message: "Hackathon updated successfully.",
            hackathon: {
                id: hackathonId,
                eventName,
                description,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: err.message});
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
hackathonRouter.route('/hackathons/users/roles').post(authenticateToken, async (req, res) => {
    const {hackathonId, userId, hackathonRoles} = req.body;
    try {
        const authorized = await userIsSiteAdminOrHasHackathonRole(req, hackathonId, ['admin']);
        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        if (!hackathonId) {
            res.status(400).json({success: false, message: "Missing required field hackathonId"})
            return;
        }

        if (!userId) {
            res.status(400).json({success: false, message: "Missing required field userId"})
            return;
        }

        if (!hackathonRoles || hackathonRoles.length === 0) {
            res.status(400).json({success: false, message: "Missing required field hackathonRoles"})
            return;
        }

        const roleIds = await getRoleIds(hackathonRoles);
        if (!roleIds) {
            res.status(400).json({success: false, message: "Role(s) not found"})
            return;
        }

        // Send back which roles were not found
        const roleNames = Object.keys(roleIds);
        const missingRoles = hackathonRoles.filter(role => !roleNames.includes(role));
        if (missingRoles.length > 0) {
            res.status(400).json({success: false, message: `Hackathon role(s) ${missingRoles.join(', ')} not found`})
            return;
        }

        // Check if user is already in hackathon
        const existingHackathonUser = await knex('hackathon_user')
            .where('hackathonId', hackathonId)
            .where('userId', userId)
            .first();

        let hackathonUserId;
        if (!existingHackathonUser) {
            // insert user into hackathon_user
            const insertResult = await knex('hackathon_user')
                .insert({hackathonId, userId});
            if (!insertResult || insertResult.length === 0) {
                res.status(500).json({success: false, message: "Error adding user to hackathon"})
                return;
            }
            hackathonUserId = insertResult[0];
        } else {
            hackathonUserId = existingHackathonUser.id;
        }

        const newHackathonUserRoles = await addHackathonUserRoles(knex, hackathonUserId, Object.values(roleIds));
        if (!newHackathonUserRoles) {
            res.status(500).json({success: false, message: "Error adding user to hackathon"})
            return;
        }
        res.status(200).json({
            success: true, message: "User added to hackathon successfully.",
            user: {
                hackathonId,
                userId,
                hackathonRoles
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: err.message});
    }
})

hackathonRouter.route('/hackathons/:hackathonId/users/:userId/roles/:roleName').delete(authenticateToken, async (req, res) => {
    try {
        const authorized = await userIsSiteAdminOrHasHackathonRole(req, req.params.hackathonId, ['admin']);
        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        const hackathonId = req.params.hackathonId;
        const userId = req.params.userId;
        const roleName = req.params.roleName;
        if (!hackathonId) {
            res.status(400).json({success: false, message: "Missing required field hackathonId"})
            return;
        }
        if (!userId) {
            res.status(400).json({success: false, message: "Missing required field userId"})
            return;
        }
        if (!roleName) {
            res.status(400).json({success: false, message: "Missing required field roleName"})
            return;
        }

        const roleIds = await getRoleIds([roleName]);
        if (!roleIds) {
            res.status(400).json({success: false, message: "Role(s) not found"})
            return;
        }
        const roleIdsToDelete = Object.values(roleIds);

        // get hackathonUserId
        const hackathonUser = await knex('hackathon_user')
            .where('hackathonId', hackathonId)
            .where('userId', userId)
            .first();

        if (!hackathonUser) {
            res.status(404).json({success: false, message: "User not found in hackathon"})
            return;
        }

        await knex('hackathon_user_role')
            .where('hackathonUserId', hackathonUser.id)
            .whereIn('hackathonRoleId', roleIdsToDelete)
            .delete();
        res.status(200).json({success: true, message: "User role(s) removed from hackathon successfully."});
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: err.message});
    }
});

hackathonRouter.route('/hackathons/:hackathonId/users/:userId').delete(authenticateToken, async (req, res) => {
    try {
        const authorized = await userIsSiteAdminOrHasHackathonRole(req, req.params.hackathonId, ['admin']);
        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        const hackathonId = req.params.hackathonId;
        const userId = req.params.userId;
        if (!hackathonId) {
            res.status(400).json({success: false, message: "Missing required field hackathonId"})
            return;
        }
        if (!userId) {
            res.status(400).json({success: false, message: "Missing required field userId"})
            return;
        }
        const hackathonUser = await knex('hackathon_user')
            .where('hackathonId', hackathonId)
            .where('userId', userId)
            .first();
        if (!hackathonUser) {
            res.status(404).json({success: false, message: "User not found in hackathon"})
            return;
        }

        await knex('hackathon_user_role')
            .where('hackathonUserId', hackathonUser.id)
            .delete();

        await knex('hackathon_user')
            .where('id', hackathonUser.id)
            .delete();

        res.status(200).json({success: true, message: "User removed from hackathon successfully."});


    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: err.message});
    }
});

hackathonRouter.route('/hackathons/:id/users').get(authenticateToken, async (req, res, next) => {
    try {
        const hackathonId = req.params.id;
        const authorized = await userIsSiteAdminOrHackathonMember(req, hackathonId)
        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }

        const hackathonUsers = await knex('hackathon_user')
            .leftJoin('hackathon_user_role', 'hackathon_user.id', '=', 'hackathon_user_role.hackathonUserId')
            .leftJoin('hackathon_role', 'hackathon_user_role.hackathonRoleId', '=', 'hackathon_role.id')
            .join('user', 'hackathon_user.userId', '=', 'user.id')
            .select(
                'user.email',
                'user.id as userId',
                'hackathon_user.hackathonId',
                'hackathon_user_role.hackathonRoleId',
                'hackathon_role.name as hackathonRoleName'
            )
            .where('hackathon_user.hackathonId', hackathonId)
            .orderBy('user.email', 'asc', 'hackathon_role.name', 'asc');

        if (!hackathonUsers) {
            res.status(404).json({success: false, message: "Hackathon not found"})
            return;
        }
        const hackathonUsersWithRoles = hackathonUsers.reduce((acc, user) => {
                const userWithRoles = acc.find(u => u.id === user.userId);
                if (userWithRoles && user.hackathonRoleName) {
                    userWithRoles.hackathonRoles.push(user.hackathonRoleName);
                } else {
                    const hackathonRoles = [];
                    if (user.hackathonRoleName) {
                        hackathonRoles.push(user.hackathonRoleName);
                    }
                    acc.push({id: user.userId, email: user.email, hackathonRoles: hackathonRoles});
                }
                return acc;
            }
            , []);
        res.json(hackathonUsersWithRoles);
    } catch (err) {
        next(err)
    }
});

module.exports = hackathonRouter;