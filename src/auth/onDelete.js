const functions = require('firebase-functions/v1');

const API = "https://api-vogat.vercel.app/"
const API_VERSION = "v1"

exports.deleteUserFromPrisma = functions.auth.user().onDelete(async (user) => {
  const { uid } = user;

  const apiUrl = `${API}api/${API_VERSION}/users`;

  try {
    // Assuming the API supports DELETE method with uid in the URL or body
    // Here passing as query param or body depending on API design. 
    // Using body for consistency with onCreate example, but DELETE usually puts ID in URL.
    // Let's assume a generic sync endpoint that handles DELETE or a specific delete endpoint.
    // For now, I'll use the same URL but DELETE method and pass UID.
    
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
