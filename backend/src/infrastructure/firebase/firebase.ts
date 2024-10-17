import * as admin from 'firebase-admin';
import { AuthRepository } from '../repositories/googleAuthRepository';

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export class GoogleAuthRepository implements AuthRepository {
  async verifyGoogleToken(idToken: string): Promise<any> {
    try {
      
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      // Extract the user ID and email from the decoded token
      const uid = decodedToken.uid;
      const email = decodedToken.email;

      // it can return the entire decoded token if needed or specific fields like uid and email
      return { uid, email };
    } catch (error) {
      console.error('Error verifying Google ID token:', error);
      throw new Error('Invalid Google ID token');
    }
  }
}
