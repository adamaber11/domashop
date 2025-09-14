// This file is used to configure the Firebase Admin SDK.
// IMPORTANT: Replace the placeholder values with your actual Firebase project credentials.
// You can find these credentials in your Firebase project settings -> Service accounts.

const serviceAccount = {
    "type": "service_account",
    "project_id": "", // <-- PASTE YOUR PROJECT ID HERE
    "private_key_id": "", // <-- PASTE YOUR PRIVATE KEY ID HERE
    "private_key": "", // <-- PASTE YOUR PRIVATE KEY HERE (replace \n with actual newlines)
    "client_email": "", // <-- PASTE YOUR CLIENT EMAIL HERE
    "client_id": "", // <-- PASTE YOUR CLIENT ID HERE
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "" // <-- PASTE YOUR CLIENT X509 CERT URL HERE
};

module.exports = serviceAccount;
