import {sign} from 'jsonwebtoken';

export function generateToken(userId: string, email: string, name: string) {
    if (!process.env.JWT__KEY) {
        throw new Error('Missing JWT__KEY');
    }
    return sign({userId, email, name}, process.env.JWT__KEY, {expiresIn: '1h'});
}
