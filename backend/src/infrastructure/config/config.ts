import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.PORT,"hgg");


const configKeys={
    MONGODB_URI:process.env.MONGODB_URI as string,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET as string,
    CLIENT_URL:process.env.CLIENT_URL,
    SERVER_URL:process.env.SERVER_URL,
    SERVER_EMAIL:process.env.user,
    SERVER_PASS:process.env.pass,
    FIREBASE_TYPE:process.env.FIREBASE_TYPE,
FIREBASE_PROJECT_ID:process.env.FIREBASE_PROJECT_ID,
FIREBASE_PRIVATE_KEY_ID:process.env.FIREBASE_PRIVATE_KEY_ID,
FIREBASE_PRIVATE_KEY:process.env.FIREBASE_PRIVATE_KEY,
FIREBASE_CLIENT_EMAIL:process.env.FIREBASE_CLIENT_EMAIL,
FIREBASE_CLIENT_ID:process.env.FIREBASE_CLIENT_ID,
FIREBASE_AUTH_URI:process.env.FIREBASE_AUTH_URI,
FIREBASE_TOKEN_URI:process.env.FIREBASE_TOKEN_URI,
FIREBASE_AUTH_PROVIDER_CERT_URL:process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
FIREBASE_CLIENT_CERT_URL:process.env.FIREBASE_CLIENT_CERT_URL,
FIREBASE_UNIVERSE_DOMAIN:process.env.FIREBASE_UNIVERSE_DOMAIN

}

export default configKeys