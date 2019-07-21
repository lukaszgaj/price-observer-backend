import {sign} from 'jsonwebtoken';

export function generateToken(userId: string) {
    if (!process.env.JWT__KEY) {
        throw new Error('Missing JWT__KEY');
    }
    return sign({id: userId}, process.env.JWT__KEY, {expiresIn: '1h'});
}
