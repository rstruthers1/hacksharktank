const express = require('express');
const knex = require('../config/knex')
const hackathonIdeaRouter = express.Router();
const authenticateToken = require("../middleware/auth");
const {userIsSiteAdminOrHackathonMember} = require("../utils/authUtils");

/*
Return the following:
[
    {
        "id": 1,
        "title": "My idea",
        "description": "My description",
        "createdAt": "2020-10-16T19:05:07.000Z",
        "updatedAt": "2020-10-16T19:05:07.000Z",
        "hackathonId": 1,
        "userId": 1
    }
 ]
 */
hackathonIdeaRouter.route('/hackathons/:hackathonId/ideas').get(authenticateToken, async (req, res) => {
    try {
        const {hackathonId} = req.params;
        const authorized = await userIsSiteAdminOrHackathonMember(req, hackathonId);
        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        const hackathonIdeas = await knex('hackathon_idea')
            .join('hackathon_user', 'hackathon_idea.hackathonUserId', 'hackathon_user.id')
            .join('hackathon', 'hackathon_user.hackathonId', 'hackathon.id')
            .join('user', 'hackathon_user.userId', 'user.id')
            .where('hackathon.id', hackathonId)
            .select('hackathon_idea.id',
                'hackathon_idea.title',
                'hackathon_idea.description',
                'hackathon_idea.createdAt',
                'hackathon_idea.updatedAt',
                'hackathon.id as hackathonId',
                'user.id as userId')
        const ideasToReturn = hackathonIdeas.map(hackathonIdea => {
            return {
                id: hackathonIdea.id,
                title: hackathonIdea.title,
                description: hackathonIdea.description,
                createdAt: hackathonIdea.createdAt,
                updatedAt: hackathonIdea.updatedAt,
                hackathonId: hackathonIdea.hackathonId,
                userId: hackathonIdea.userId
            }});
        res.json(ideasToReturn);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Something went wrong'});
    }
})

/*
Sample payload:
{

    "userId": 1,
    "title": "My idea",
    "description": "My description"
}
 */
hackathonIdeaRouter.route('/hackathons/:hackathonId/ideas').post(authenticateToken, async (req, res) => {
    try {
        const {hackathonId} = req.params;
        const {userId, title, description} = req.body;
        const authorized = await userIsSiteAdminOrHackathonMember(req, hackathonId);

        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        if (!title || !description) {
            res.status(400).json({error: 'Title and description are required'});
            return;
        }
        const hackathonUser = await knex('hackathon_user')
            .where({hackathonId: hackathonId, userId: userId})
            .first()
        if (!hackathonUser) {
            res.status(400).json({error: 'User is not a member of this hackathon'});
            return;
        }
        const hackathonIdea = await knex('hackathon_idea')
            .insert({hackathonUserId: hackathonUser.id, title, description})
            .returning('*');
        res.json(hackathonIdea);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Something went wrong', message: err.message});
    }
});

hackathonIdeaRouter.route('/hackathons/:hackathonId/ideas').put(authenticateToken, async (req, res) => {
    try {
        const {hackathonId} = req.params;
        const {title, description, id} = req.body;
        // Refactor duplicated code into common method

        const authorized = await userIsSiteAdminOrHackathonMember(req, hackathonId);

        if (!authorized)  {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }
        if (!title || !description) {
            res.status(400).json({error: 'Title and description are required'});
            return;
        }

        const ideaId = parseInt(id);
        const hackathonIdea = await knex('hackathon_idea')
            .where({id: ideaId})
            .update({title, description});
        res.json(hackathonIdea);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Something went wrong', message: err.message});
    }
});


hackathonIdeaRouter.route('/hackathons/:hackathonId/ideas/:ideaId').delete(authenticateToken, async (req, res) => {
    try {
        const {hackathonId, ideaId} = req.params;

        // get the logged-in user
        const authUserId = req.user.id;

        // check to see if logged-in user created the idea
        const hackathonIdea = await knex('hackathon_idea')
            .join('hackathon_user', 'hackathon_idea.hackathonUserId', 'hackathon_user.id')
            .join('hackathon', 'hackathon_user.hackathonId', 'hackathon.id')
            .join('user', 'hackathon_user.userId', 'user.id')
            .where('hackathon.id', hackathonId)
            .where('hackathon_idea.id', ideaId)
            .where('user.id', authUserId)
            .first();

       // if the idea was not created by the logged-in user, then return an error
        if (!hackathonIdea) {
            res.status(401).json({success: false, message: "Unauthorized"})
            return;
        }

        const hackathonIdeaDeleteResult = await knex('hackathon_idea')
            .where({id: ideaId})
            .del()
            .returning('*');
        res.json({success: true});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Something went wrong'});
    }
});

module.exports = hackathonIdeaRouter;