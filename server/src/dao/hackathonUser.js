const knex = require("../config/knex");
const getHackathonUser = async (hackathonId, userId) => {
    try {
        return await knex('hackathon_user')
            .select('hackathon_user.*', 'hackathon_role.name as roleName')
            .leftJoin('hackathon_user_role', 'hackathon_user.id', 'hackathon_user_role.hackathonUserId')
            .leftJoin('hackathon_role', 'hackathon_user_role.hackathonRoleId', 'hackathon_role.id')
            .where('hackathon_user.hackathonId', hackathonId)
            .andWhere('hackathon_user.userId', userId)
            .first();
    } catch (err) {
        console.error(err);
        return null;

    }
}

const addHackathonUserRoles = async (knex, hackathonUserId, roleIds) => {
    try {
        const userRoles = roleIds.map(roleId => {
            return {
                hackathonUserId: hackathonUserId,
                hackathonRoleId: roleId
            };
        });

        return await knex('hackathon_user_role')
            .insert(userRoles)
            .onConflict(['hackathonUserId', 'hackathonRoleId']) // specify the conflicting columns
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