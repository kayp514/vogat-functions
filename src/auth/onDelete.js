const functions = require('firebase-functions/v1');

const API = "https://api-vogat.vercel.app/"
const API_VERSION = "v1"

exports.deleteUserFromPrisma = functions.auth.user().onDelete(async (user) => {
  const { uid } = user;

  const apiUrl = `${API}/${API_VERSION}/users`;

  try {
    const response = await fetch(`${apiUrl}/${uid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete user: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    console.log(`Successfully deleted user ${uid} via REST API.`);
  } catch (error) {
    console.error('Error deleting user via REST API:', error);
    throw error;
  }
});
