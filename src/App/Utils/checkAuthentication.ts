import {Principal} from '../../Infrastructure/Auth/Principal';

export async function checkAuthentication(principal: Principal) {
    if (!(await principal.isAuthenticated())) {
        throw new Error('Not authorized');
    }
}
