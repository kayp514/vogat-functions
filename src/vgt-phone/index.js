const { syncUserToPrisma } = require('./auth/onCreate');
const { deleteUserFromPrisma } = require('./auth/onDelete');

module.exports = { syncUserToPrisma, deleteUserFromPrisma };
