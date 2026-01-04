const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

const API = "https://api-vogat.vercel.app/pbx";
const API_VERSION = "v1";

exports.syncUserToVgtPbxDB = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL, phoneNumber, tenantId, disabled } =
    user;
  const { creationTime, lastSignInTime } = user.metadata;

  const inviteUrl = `${API}/${API_VERSION}/invites`;
  const createUserUrl = `${API}/${API_VERSION}/users`;

  try {
    const inviteResponse = await fetch(
      `${inviteUrl}?email=${encodeURIComponent(email)}`
    );
    const inviteData = await inviteResponse.json();

    let isAdmin = true;

    if (inviteData.success && inviteData.invite && inviteData.invite.email) {
      isAdmin = false;
      console.log(`Invite found for ${email}, setting isAdmin to false`);
    } else {
      isAdmin = true;
      console.log(`No invite found for ${email}, setting isAdmin to true`);
    }

    const customClaims = {
      admin: isAdmin,
    };

    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    console.log(`Custom claims set for ${user.uid}:`, customClaims);

    const userData = {
      uid,
      email: email ? email.toLowerCase() : null,
      displayName,
      avatar: photoURL,
      tenantId,
      isAdmin: isAdmin,
      isStaff: false,
      isSuperuser: false,
      phoneNumber,
      createdAt: creationTime ? new Date(creationTime) : new Date(),
      lastSignInAt: lastSignInTime ? new Date(lastSignInTime) : new Date(),
      updatedAt: new Date(),
      disabled: disabled || false,
    };

    const createUserResponse = await fetch(createUserUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const createUserResult = await createUserResponse.json();

    if (!createUserResult.success) {
      console.error(
        `Failed to create auth_user for ${user.uid}:`,
        createUserResult.error
      );
      throw new Error(createUserResult.error.message);
    }

    console.log(
      `Successfully created auth_user record for ${user.uid} with isAdmin: ${isAdmin}`
    );

    return;
  } catch (error) {
    console.error(`Error processing user creation for ${user.uid}:`, error);
    throw error;
  }
});
