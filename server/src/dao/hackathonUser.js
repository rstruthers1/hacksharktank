const knex = require("../config/knex");
const getHackathonUser = async (hackathonId, userId) => {
    try {
        return await knex('user_hackathon_role')
            .where('hackathonId', hackathonId)
            .andWhere('userId', userId)
            .first();
    } catch (err) {
        console.error(err);
        return null;

    }
}

const addHackathonUserRoles = async (knex, hackathonId, userId, roleIds) => {
    try {
        const userRoles = roleIds.map(roleId => {
            return {
                userId: userId,
                hackathonId: hackathonId,
                hackathonRoleId: roleId
            };
        });

        return await knex('user_hackathon_role')
            .insert(userRoles)
            .onConflict(['userId', 'hackathonId', 'hackathonRoleId']) // specify the conflicting columns
            .merge() // merge new values for existing rows, insert otherwise
    } catch (error) {
        console.error('Error adding user roles:', error.message);
        return null;
    }
};

module.exports = {
    getHackathonUser,
    addHackathonUserRoles
}