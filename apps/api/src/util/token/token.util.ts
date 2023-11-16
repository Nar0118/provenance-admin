import * as jwt from 'jsonwebtoken';
import env from '../constants/env';
import { CustomError, ErrorCodes } from '../error/error.util';

export const JWT_SECRETS: object = {
  auth: env.secretJwtCode,
};

export enum TokenTypes {
  AUTH = 'auth',
}

export type DecodedToken = Record<string, any>;

/**
 * Given a JWT token, returns the decoded token or throws if the token is not valid.
 */
export const decodeJwtToken = async (
  token: string,
  type: TokenTypes
): Promise<DecodedToken> =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      JWT_SECRETS[type],
      async (err: Error | null, decodedToken: any) => {
        if (err) {
          return reject(
            new CustomError(
              'Invalid or expired token',
              ErrorCodes.INVALID_OR_EXPIRED_TOKEN
            )
          );
        }

        return resolve(decodedToken);
      }
    );
  });

/**
 * Given an object and a type of secret, generate a JWT token.
 */
export const encodeJwtToken = async (
  data: object | any,
  type: TokenTypes,
  options: object = {}
): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(
      data,
      JWT_SECRETS[type],
      options,
      async (err: Error | null, token: any) => {
        if (err) {
          return reject(err);
        }

        return resolve(token);
      }
    );
  });
