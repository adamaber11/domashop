import * as admin from 'firebase-admin';
// Use a direct import for the service account configuration
// to avoid issues with environment variable loading in some server environments.
const serviceAccount = require('../../scripts/firebase-admin-config.js');

// Initialize the app only once
const adminApp = admin.apps.length 
    ? admin.apps[0] as admin.app.App 
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });

export function getFirebaseAdminApp() {
  return adminApp;
}
