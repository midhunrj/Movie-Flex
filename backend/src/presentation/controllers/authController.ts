import { Request, Response } from 'express';
import { AuthService } from '../../application/services/authService';

export class AuthController {
  private authService: AuthService;


  constructor(authService: AuthService) {
    console.log("constructor");

    this.authService = authService;
console.log("this",this.authService);

  }
  
  googleLogin = async (req: Request, res: Response) => {
    try {
        console.log(req.body ,"googlelogin authentication");
        
      const { token } = req.body;
      const { user, accessToken, refreshToken, role } = await this.authService.loginWithGoogle(token);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: 'Google sign-in successful',
        user,
        accessToken,
        role,
      });
    } catch (error) {
      console.error('Google sign-in failed:', error);
      res.status(500).json({ message: 'Google sign-in failed' });
    }
  };


  refreshAccessToken= async(req: Request, res: Response) =>{
    try {
        console.log("Request cookies:", req.cookies);  
        const { refreshToken } = req.cookies;
        console.log("Refresh token from cookies:", refreshToken);  

        if (!refreshToken) {
            console.log("No refresh token found");  
            return res.status(401).json({ message: "Refresh token is missing" });
        }

        const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
        console.log("New Access Token:", newAccessToken); 
        res.status(200).json({ message: "New access token created", accessToken: newAccessToken });

    } catch (error) {
        console.error("Error while refreshing access token:", error);  
        res.status(500).json({ message: "Failed to refresh access token" });
    }
}

adminRefreshAccessToken= async(req: Request, res: Response) =>{
  try {
      console.log("Request cookies:", req.cookies);  
      const { adminRefreshToken } = req.cookies;
      console.log("Refresh token from cookies:", adminRefreshToken);  

      if (!adminRefreshToken) {
          console.log("No refresh token found");  
          return res.status(401).json({ message: "Refresh token is missing" });
      }

      const newAccessToken = await this.authService.refreshAccessToken(adminRefreshToken);
      console.log("New Access Token:", newAccessToken); 
      res.status(200).json({ message: "New access token created", accessToken: newAccessToken });

  } catch (error) {
      console.error("Error while refreshing access token:", error);  
      res.status(500).json({ message: "Failed to refresh access token" });
  }
}

theatreRefreshAccessToken= async(req: Request, res: Response) =>{
  try {
      console.log("Request cookies:", req.cookies);  
      const { theatreRefreshToken } = req.cookies;
      console.log("Refresh token from cookies:", theatreRefreshToken);  

      if (!theatreRefreshToken) {
          console.log("No refresh token found");  
          return res.status(401).json({ message: "Refresh token is missing" });
      }

      const newAccessToken = await this.authService.refreshAccessToken(theatreRefreshToken);
      console.log("New Access Token:", newAccessToken); 
      res.status(200).json({ message: "New access token created", accessToken: newAccessToken });

  } catch (error) {
      console.error("Error while refreshing access token:", error);  
      res.status(500).json({ message: "Failed to refresh access token" });
  }
}

}
