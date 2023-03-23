import { SignOptions, sign, verify } from "jsonwebtoken";
import config from "config";

// ? Sign Access or Refresh Token
export const signJwt = (
    payload: Object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options: SignOptions
) => {
    const privateKey = Buffer
    .from(config.get<string>(keyName), 'base64')
    .toString('ascii');
    try {
      return sign(payload, privateKey, {
          ...(options && options),
          algorithm: "RS256",
      });
    } catch(err) {
      console.log(err);
    }
};

// ? Verify Access or Refresh Token
export const verifyJwt = <T>(
    token: string,
    keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null => {
    try {
      const publicKey = Buffer
        .from(config.get<string>(keyName), 'base64')
        .toString('ascii');
      const decoded = verify(token, publicKey) as T;
  
      return decoded;
    } catch (error) {
      return null;
    }
};