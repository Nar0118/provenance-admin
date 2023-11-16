import { NextFunction, Request, Response } from 'express';
import { User, UserRoles } from '../models/User';
import { decodeJwtToken, TokenTypes } from '../util/token/token.util';

/**
 * Higher order function that can take a TokenType and returns
 * the middleware function
 */
export const requireAuthHOF = (tokenType: TokenTypes) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let token: string;

        if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            token = req.query.token as string;
        } else {
            res.send({ error: 'Missing or invalid token' });
        }

        try {
            const decodedToken = await decodeJwtToken(token, tokenType);

            req['decodedToken'] = decodedToken;
            req['user'] = await User.findById(decodedToken.id);

            if (!req['user']) {
                // token considered invalid if no user can be found
                // in the database that is associated to it
                res.send({ error: 'User does not exist!' });
            }

            return next()
        } catch (decodeError) {
            res.send({ error: decodeError });
        }
    }

/**
* Higher order function that can take a TokenType and returns
* the middleware function for Admin
*/
export const requireAuthHOFAdmin = (tokenType: TokenTypes) =>
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        let token: string;

        if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            token = req.query.token as string;
        } else {
            return res.send({ success: false, error: 'Missing or invalid token' });
        }

        try {
            const decodedToken = await decodeJwtToken(token, tokenType);

            req['decodedToken'] = decodedToken;
            req['user'] = await User.findById(decodedToken.id);

            if (!req['user']) {
                // token considered invalid if no user can be found
                // in the database that is associated to it
                return res.send({ success: false, error: 'User does not exist!' });
            }

            if (req['user'].role !== UserRoles.ADMIN) {
                return res.send({
                    success: false,
                    error: 'Access Denied: You dont have correct privilege to perform this operation'
                });
            }

            return next()
        } catch (decodeError) {
            res.send({ success: false, error: decodeError });
        }
    }

/**
 * This method replicates what is being done using 'express-jwt' package
 * in the method above (authMiddleware) but using only the 'jsonwebtoken'
 * package. It is intended to replace the method above.
 *
 * It also does more than the method above since it will also attach
 * the full user object from the DB.
 */
export const requireAuth = requireAuthHOF(TokenTypes.AUTH);
export const requireAuthAdmin = requireAuthHOFAdmin(TokenTypes.AUTH);
