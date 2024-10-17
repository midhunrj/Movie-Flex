// import jwt from 'jsonwebtoken'

// export class JWTService{
//     private accessTokenSecret:string,
//     private refreshTokenSecret:string,
//     private accessTokenExpiry:string,
//     private refreshTokenExpiry:string
//     constructor(
//         this.accessTokenSecret=process.env.accessTokenSecret|"default token secret",
//         this.refreshTokenSecret=process.env.refreshTokenSecret|"default refresh secret",
//         this.accessTokenExpiry='15m',
//         this.refreshTokenExpiry='7d'
//     )

// }

import jwt,{JwtPayload} from 'jsonwebtoken';
import { log } from 'node:console';

export class JWTService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default_token_secret';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';
    this.accessTokenExpiry = '7m';
    this.refreshTokenExpiry = '7d';
  }

  signAccessToken(payload: object): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: this.accessTokenExpiry });
  }

  signRefreshToken(payload: object): string {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: this.refreshTokenExpiry });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret);
      console.log(decoded,"decode token");
      
      return typeof decoded === 'string' ? null : decoded;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret);
      return typeof decoded === 'string' ? null : decoded;
    } catch (error) {
      return null;
    }
}
}
