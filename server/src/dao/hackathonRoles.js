const knex = require('../config/knex');

const getRoleIds = async (roleNames) => {
    try {
    const roles = await knex('hackathon_role').whereIn('name', roleNames).select('id', 'name');
    return roles.reduce((acc, role) => {
        acc[role.name] = role.id;
        return acc;
    }, {});
    } catch (err) {
        console.error(err);
        return null;
    }
};



// Make available to other files
module.exports = {
    getRoleIds
};

