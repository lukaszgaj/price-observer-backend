import {User} from '../../App/APIModels/User/User';

export abstract class UsersRepository {
    abstract async getUserByEmail(email: string): Promise<User | null>;
    abstract getUserByName(name: string): User | null;
    abstract store(user: User): void;
}
