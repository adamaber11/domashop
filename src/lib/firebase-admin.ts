import * as admin from 'firebase-admin';
import 'dotenv/config';

let adminApp: admin.app.App;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  if (!serviceAccount.project_id) {
    console.warn("Firebase Admin SDK not initialized. Missing environment variables.");
    return null as any; 
  }

  return admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export function getFirebaseAdminApp() {
  if (!adminApp) {
    adminApp = initializeAdminApp();
  }
  return adminApp;
}
