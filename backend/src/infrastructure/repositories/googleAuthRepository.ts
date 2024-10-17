// import { AuthRepository } from "../../application/repositories/authRepository";
// import { auth,googleProvider } from "../firebase/firebase";
// import {GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
// export class GoogleAuthRepository implements AuthRepository{
//     async signInWithGoogle(): Promise<any> {
//         try {
//             console.log("Auth repo: Starting Google sign-in");
            
//             const result = await signInWithPopup(auth, googleProvider);
//             console.log("Auth repo: Google sign-in successful", result);
            
//             const credential = GoogleAuthProvider.credentialFromResult(result);
//             console.log("Auth repo: Credential obtained", credential);
            
//             const token = credential?.accessToken;
//             console.log("Auth repo: Access token retrieved", token);
            
//             const user = result.user;
//             console.log("Auth repo: User info", user, "Token", token);
            
//             return { user, token };
//         } catch (error) {
//             console.error("Auth repo: Error during Google sign-in", error);
//             throw new Error('Google sign-in failed');
//         }
//     }
    
// }

// import * as admin from 'firebase-admin';
// import { AuthRepository } from '../../application/repositories/authRepository';

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(), // or use a service account key file
// });

// export class GoogleAuthRepository implements AuthRepository {
//   async verifyGoogleToken(idToken: string): Promise<{ uid: string; email: string }> {
//     try {
//       // Verify the ID token using Firebase Admin SDK
//       const decodedToken = await admin.auth().verifyIdToken(idToken);

//       // Extract the user ID and email from the decoded token
//       const uid = decodedToken.uid;
//       const email = decodedToken.email!;

//       // Return the uid and email
//       return { uid, email };
//     } catch (error) {
//       console.error('Error verifying Google ID token:', error);
//       throw new Error('Invalid Google ID token');
//     }
//   }
// }


import * as admin from 'firebase-admin';
import { IAuthRepository } from '../../application/repositories/authRepository';

// Initialize Firebase Admin SDK with the service account key
console.log(__dirname);
const serviceAccount = require('../firebase/serviceAccountkey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export class AuthRepository implements IAuthRepository {
  async verifyGoogleToken(token: string): Promise<{ uid: string; name:string,email: string }> {
    try {
      
      const decodedToken = await admin.auth().verifyIdToken(token);

      console.log(decodedToken,"google login token");
      const name=decodedToken.name
      const uid = decodedToken.uid;
      const email = decodedToken.email!;

      
      return { uid,name, email };
    } catch (error) {
      console.error('Error verifying Google ID token:', error);
      throw new Error('Invalid Google ID token');
    }
  }
}
