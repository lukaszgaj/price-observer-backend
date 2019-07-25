import {AuthPrincipal} from '../../App/Auth/AuthPrincipal';
import {interfaces} from 'inversify-express-utils';
import {UserDetails} from '../../Domain/Auth/UserDetails';

export class Principal implements AuthPrincipal, interfaces.Principal {
    details: any;

    constructor(
        details?: UserDetails,
        private token?: string,
    ) {
        this.details = details;
    }

    getDetails(): UserDetails {
        if (!this.details || !this.token) {
            throw new Error('Make sure user is authenticated');
        }

        return this.details;
    }

    getTokenAsString(): string {
        if (!this.details || !this.token) {
            throw new Error('Make sure user is authenticated');
        }

        return this.token;
    }

    async isAuthenticated(): Promise<boolean> {
        return !!this.details;
    }

    async isInRole(role: string): Promise<boolean> {
        if (!this.details) {
            return false;
        }

        return this.getDetails().userRolesArray.indexOf(role) > -1;
    }

    async isResourceOwner(resourceId: any): Promise<boolean> {
        console.log(resourceId);
        return this.isAuthenticated();
    }
}
