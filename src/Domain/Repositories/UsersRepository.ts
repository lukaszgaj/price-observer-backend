import {User} from '../../App/APIModels/User/User';

export abstract class UsersRepository {
    abstract async getUserByEmail(email: string): Promise<User | null>;
    abstract async getUserByName(name: string): Promise<User | null>;
    abstract async getUserById(id: string): Promise<User | null>;
    abstract async update(user: User): Promise<User|null>;
    abstract async store(user: User): Promise<void>;
}
