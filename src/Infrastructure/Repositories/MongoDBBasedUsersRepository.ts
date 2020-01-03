import {injectable} from 'inversify';
import {User} from '../../App/APIModels/User/User';
import {UsersRepository} from '../../Domain/Repositories/UsersRepository';

@injectable()
export class MongoDBBasedUsersRepository implements UsersRepository {
    private userModel = this.user.getModelForClass(User);

    constructor(
        private user: User,
    ) {
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({
            email,
        })
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async getUserByName(name: string): Promise<User | null> {
        return await this.userModel.findOne({
            name,
        })
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userModel.findById(id)
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async update(user: User): Promise<User | null> {
        return await this.userModel.findOneAndUpdate(
            {
                _id: user._id,
            },
            user,
            {upsert: false},
        )
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async store(user: User): Promise<void> {
        await this.userModel.create({
            email: user.email,
            name: user.name,
            password: user.password,
        }).then(res => {
            return res;
        }).catch(e => {
            console.log('Could not store user because of: ', e);
        });
    }
}
