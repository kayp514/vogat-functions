const functions = require('@google-cloud/functions-framework');

var admin = require('firebase-admin');

functions.http('manageUsers', (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  
  if (!admin.apps.length) {
  var app = admin.initializeApp({
    credential: admin.credential.cert('iam-admin-identitytool.json')
  });
  }
  const auth = admin.auth();
  const listAllUsers = (nextPageToken) => {
    return auth
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        const users = [];
        listUsersResult.users.forEach((userRecord) => {
          users.push(userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          return listAllUsers(listUsersResult.pageToken);
        } else {
          return JSON.stringify({users: users});
        }
      })
      .catch((error) => {
        console.log('Error listing users:', error);
      });
  };
  listAllUsers()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});