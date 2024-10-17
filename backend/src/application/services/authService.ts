// import { GoogleAuthRepository } from "../../infrastructure/repositories/googleAuthRepository";
// import { LogInWithGoogleCase } from "../usecases/googleAuth";

// const authRepo=new GoogleAuthRepository()

// const loginWithGoogleUseCase=new LogInWithGoogleCase(authRepo)
// export const loginWithGoogle=async()=>{
//     return await loginWithGoogleUseCase.loginWithGoogle()
// }

import { AuthUseCase } from "../usecases/googleAuth";

export class AuthService {
  private authLoginUseCase: AuthUseCase;

  constructor(authLoginUseCase: AuthUseCase) {
    this.authLoginUseCase = authLoginUseCase;
  }

  async loginWithGoogle(idToken: string) {
    return await this.authLoginUseCase.loginWithGoogle(idToken);
  }

  async refreshAccessToken(refreshToken:string){
    console.log("kif");
    
    return await this.authLoginUseCase.refreshAccessToken(refreshToken)
  }
}
