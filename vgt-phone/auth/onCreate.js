const functions = require('firebase-functions/v1');

const API = "https://api-vogat.vercel.app/"
const API_VERSION = "v1"


exports.syncUserToPrisma = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL, phoneNumber, emailVerified, tenantId, disabled } = user;
  const { creationTime, lastSignInTime } = user.metadata;

  const userData = {
    uid,
    email: email?.toLowerCase(),
    name: displayName,
    avatar: photoURL,
    tenantId,
    isAdmin: (user.customClaims?.admin) || false,
    phoneNumber,
    emailVerified,
    createdAt: creationTime ? new Date(creationTime) : new Date(),
    lastSignInAt: lastSignInTime ? new Date(lastSignInTime) : new Date(),
    updatedAt: new Date(),
    disabled: disabled || false,
  };

  const apiUrl = `${API}/${API_VERSION}/users`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to sync user: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    console.log(`Successfully synced user ${uid} to REST API.`);
  } catch (error) {
    console.error('Error syncing user to REST API:', error);
    throw error;
  }
});
