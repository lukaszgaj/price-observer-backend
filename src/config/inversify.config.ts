import {Container, decorate, injectable} from 'inversify';
import {Typegoose} from 'typegoose';
import {Product} from '../App/APIModels/Product/Product';
import {User} from '../App/APIModels/User/User';
import {ProductsRepository} from '../Domain/Repositories/ProductsRepository';
import {UsersRepository} from '../Domain/Repositories/UsersRepository';
import {MongoDBBasedProductsRepository} from '../Infrastructure/Repositories/MongoDBBasedProductsRepository';
import {MongoDBBasedUsersRepository} from '../Infrastructure/Repositories/MongoDBBasedUsersRepository';
import {MoreleParser} from '../Infrastructure/Services/Parsers/MoreleParser';
import {ProductsObserver} from '../Infrastructure/Services/ProductsObserver';
import {EmailSender} from '../Infrastructure/Services/EmailSender';

export function initializeContainer() {
    const container = new Container();
    decorate(injectable(), Typegoose);

// Models
    container.bind(User).toSelf();
    container.bind(Product).toSelf();

// Respositories
    container.bind(UsersRepository).to(MongoDBBasedUsersRepository);
    container.bind(ProductsRepository).to(MongoDBBasedProductsRepository);

// Services
    container.bind(MoreleParser).toSelf();
    container.bind(ProductsObserver).toSelf();
    container.bind(EmailSender).toSelf();
    return container;
}
