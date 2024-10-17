// // import { auth,googleProvider } from "../../infrastructure/firebase/firebase";
// // import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
// // import jwt from "jsonwebtoken"
// // import configKeys from "../../infrastructure/config/config";
// // import { GoogleAuthRepository } from "../../infrastructure/repositories/googleAuthRepository";
// // export class LogInWithGoogleCase{


// //     private authRepo:GoogleAuthRepository;
// //     constructor(authRepo:GoogleAuthRepository)
// //     {
// //         this.authRepo=authRepo
// //     }
// //     async loginWithGoogle()
// //     {
// //         console.log("hello i am in usecase");
        
// //         const user=await this.authRepo.signInWithGoogle()

// //         const role="user"
// //         const accessToken=jwt.sign(
// //             {userId:user.uid,role},
// //              configKeys.JWT_SECRET,
// //              {expiresIn:'15m'}
// //         )

// //         const refreshToken=jwt.sign(
// //             {userId:user.uid},
// //             configKeys.JWT_SECRET,
// //             {expiresIn:'7d'}
// //         )
// //         console.log("user,accessToken,refreshToken,role",user,accessToken,refreshToken,role);
        
// //         return {user,accessToken,refreshToken,role}
        
// //     }

// import jwt from 'jsonwebtoken';
// import configKeys from '../../infrastructure/config/config';
// import { AuthRepository } from '../repositories/authRepository';

// export class GoogleLoginUseCase {
//   private authRepo: AuthRepository;

//   constructor(authRepo: AuthRepository) {
//     this.authRepo = authRepo;
//   }

//   async execute(idToken: string) {
//     const user = await this.authRepo.verifyGoogleToken(idToken);

//     const role = 'user';
//     const accessToken = jwt.sign(
//       { userId: user.uid, role },
//       configKeys.JWT_SECRET,
//       { expiresIn: '15m' }
//     );

//     const refreshToken = jwt.sign(
//       { userId: user.uid },
//       configKeys.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     return { user, accessToken, refreshToken, role };
//   }
// }





//     // try{
//     //     const result=await signInWithPopup(auth,googleProvider)
       
//     //    const credential =GoogleAuthProvider.credentialFromResult(result)
//     //    const token=credential?.accessToken
//     //     const user=result.user
//     //     console.log("user info",user,"Token",token);
        
//     //     return user
//     // }
//     // catch(error)
//     // {
//     //     throw new Error("google sign in failed")
//     // }
// //}

import { GoogleLoginUser } from "../../Domain/entities/user";
import { AuthRepository } from "../../infrastructure/repositories/googleAuthRepository";
import { UserRepository } from "../../infrastructure/repositories/userRepository";
import { JWTService } from "../../infrastructure/services/jwtService";

export class AuthUseCase {
  private authRepo: AuthRepository;
  private userRepo:UserRepository
  private jwtService: JWTService;

  constructor(authRepo: AuthRepository,userRepo:UserRepository, jwtService: JWTService) {
    this.authRepo = authRepo;
    this.userRepo=userRepo
    this.jwtService = jwtService;
  }

  async loginWithGoogle(idToken: string) {
    //const user = await this.authRepo.verifyGoogleToken(idToken);
    const role = 'user';
    const googleUser = await this.authRepo.verifyGoogleToken(idToken);

    // Check if the user already exists in the database using their email
    let user = await this.userRepo.findByEmail(googleUser.email);

    if (!user) {
      // Create a new user if they don't exist (Google login only requires name and email)
      user = await this.userRepo.createUser({
        name: googleUser.name, // From Google account
        email: googleUser.email,
        uid:googleUser.uid, // From Google account
        is_verified: true, // Automatically verified since it's a Google account
        is_blocked: false, // Set default as not blocked
      } as GoogleLoginUser); // Ensure only required fields are passed for Google login
    }
    const accessToken = this.jwtService.signAccessToken({ userId: user.id, role });
    const refreshToken = this.jwtService.signRefreshToken({ userId: user.id });

    return { user, accessToken, refreshToken, role };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
        const decoded = this.jwtService.verifyRefreshToken(refreshToken);
        if (!decoded) throw new Error("Invalid refresh token");

        const accessToken = this.jwtService.signAccessToken({ userId: decoded.userId, role: decoded.role });
        console.log("Generated new access token:", accessToken);  // Check new token generation
        return accessToken;
    } catch (error) {
        console.error("Error during token refresh:", error);  // Log the error
        throw new Error("Failed to refresh access token");
    }
}

}
