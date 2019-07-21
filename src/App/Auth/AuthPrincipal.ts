import {UserDetails} from '../../Domain/Auth/UserDetails';

export interface AuthPrincipal {
    getDetails(): UserDetails;
    getTokenAsString(): string;
    isAuthenticated(): Promise<boolean>;
}
