const { syncUserToPrisma } = require('../vgt-phone/auth/onCreate');
const { deleteUserFromPrisma } = require('../vgt-phone/auth/onDelete');

module.exports = { syncUserToPrisma, deleteUserFromPrisma };
