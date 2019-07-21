import {User} from '../../App/APIModels/User/User';

export abstract class UsersRepository {
    abstract async getUserByEmail(email: string): Promise<User | null>;
    abstract async getUserByName(name: string): Promise<User | null>;
    abstract async store(user: User): Promise<void>;
}
