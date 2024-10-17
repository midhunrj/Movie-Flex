// export interface AuthRepository{
//     signInWithGoogle():Promise<any>
// }

export interface IAuthRepository {
    verifyGoogleToken(idToken: string): Promise<{ uid: string; email: string }>;
  }
  