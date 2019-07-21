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

    getUserByName(name: string): any {
        return this.userModel.findOne({
            name,
        }, (err, res) => {
            if (err) {
                throw err;
            }
            return res;
        });
    }

    store(user: User): void {
        this.userModel.create({
            email: user.email,
            name: user.name,
            password: user.password,
        }).then(res => {
            return res;
        }).catch(e => {
            console.log('Couldnt store user because of: ', e);
        });
    }
}
