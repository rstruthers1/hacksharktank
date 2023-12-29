const knex = require("../config/knex");

const userIsSiteAdminOrHackathonMember = async (req, hackathonId) => {
    const authUserRoles = req.user.roles;
    let isSiteAdminOrHackathonMember = false
    if (authUserRoles && authUserRoles.includes('admin')) {
        isSiteAdminOrHackathonMember = true;
    } else {
        // check to see if logged-in user is in hackathon
        const hackathonUser = await knex('hackathon_user')
            .where('hackathonId', hackathonId)
            .where('userId', req.user.id)
            .first();
        if (hackathonUser) {
            isSiteAdminOrHackathonMember = true;
        }
    }
    return isSiteAdminOrHackathonMember;
}

const userIsSiteAdminOrHasHackathonRole = async (req, hackathonId, roles) => {
    const authUserRoles = req.user.roles;
    let isSiteAdminOrHasHackathonRole = false
    if (authUserRoles && authUserRoles.includes('admin')) {
        isSiteAdminOrHasHackathonRole = true;
    } else {
        // check to see if logged-in user is in hackathon
        const hackathonUserRoles = await knex('hackathon_user')
            .join('hackathon_user_role', 'hackathon_user.id', '=', 'hackathon_user_role.hackathonUserId')
            .join('hackathon_role', 'hackathon_user_role.hackathonRoleId', '=', 'hackathon_role.id')
            .where('hackathonId', hackathonId)
            .where('userId', req.user.id)
            .select('hackathon_role.name as role');
        if (hackathonUserRoles && roles && roles.length > 0 && hackathonUserRoles.some(hackathonUserRole => roles.includes(hackathonUserRole.role))) {
            isSiteAdminOrHasHackathonRole = true;
        }
    }
    return isSiteAdminOrHasHackathonRole;
}

const isLoggedInUserId = (req, userId) => {
    let userIdInt;
    if (typeof userId === 'string') {
        try {
            userIdInt = parseInt(userId);
        } catch (e) {
            console.error(`Error parsing userId: ${userId}`);
            return false;
        }
    } else {
        userIdInt = userId;
    }

    return req?.user?.id === userIdInt;
}

// make visible to other files
module.exports = {
    userIsSiteAdminOrHackathonMember,
    userIsSiteAdminOrHasHackathonRole,
    isLoggedInUserId
}