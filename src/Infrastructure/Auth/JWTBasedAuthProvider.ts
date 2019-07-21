import express from 'express';
import {interfaces} from 'inversify-express-utils';
import {verify} from 'jsonwebtoken';
import {UserDetails} from '../../Domain/Auth/UserDetails';
import {Principal} from './Principal';
import {injectable} from 'inversify';

@injectable()
export class JWTBasedAuthProvider implements interfaces.AuthProvider {
    async getUser(
        req: express.Request,
    ): Promise <interfaces.Principal> {
        const tokenString = req.headers.authorization || req.query._token;
        if (typeof tokenString !== 'string') {
            return new Principal();
        }
        if (!process.env.JWT__KEY) {
            throw new Error('Missing JWT__KEY');
        }
        try {
            const token = verify(tokenString, process.env.JWT__KEY);
            return new Principal(token as UserDetails, tokenString);
        } catch (e) {
            return new Principal();
        }
    }
}
