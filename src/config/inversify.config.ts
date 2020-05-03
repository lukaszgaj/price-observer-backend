import {Container, decorate, injectable} from 'inversify';
import {Typegoose} from 'typegoose';
import {User} from '../App/APIModels/User/User';
import {UsersRepository} from '../Domain/Repositories/UsersRepository';
import {MongoDBBasedUsersRepository} from '../Infrastructure/Repositories/MongoDBBasedUsersRepository';

export function initializeContainer() {
    const container = new Container();
    decorate(injectable(), Typegoose);

// Models
    container.bind(User).toSelf();

// Respositories
    container.bind(UsersRepository).to(MongoDBBasedUsersRepository);

    return container;
}
