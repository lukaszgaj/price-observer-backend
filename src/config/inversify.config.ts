import {Container, decorate, injectable} from 'inversify';
import {Typegoose} from 'typegoose';
import {DiscussionPost} from '../App/APIModels/DiscussionPost/DiscussionPost';
import {Product} from '../App/APIModels/Product/Product';
import {User} from '../App/APIModels/User/User';
import {DiscussionPostsRepository} from '../Domain/Repositories/DiscussionPostsRepository';
import {ProductsRepository} from '../Domain/Repositories/ProductsRepository';
import {UsersRepository} from '../Domain/Repositories/UsersRepository';
import {MongoDBBasedDiscussionPostsRepository} from '../Infrastructure/Repositories/MongoDBBasedDiscussionPostsRepository';
import {MongoDBBasedProductsRepository} from '../Infrastructure/Repositories/MongoDBBasedProductsRepository';
import {MongoDBBasedUsersRepository} from '../Infrastructure/Repositories/MongoDBBasedUsersRepository';
import {EmailSender} from '../Infrastructure/Services/EmailSender';
import {MoreleParser} from '../Infrastructure/Services/Parsers/MoreleParser';
import {ProductsObserver} from '../Infrastructure/Services/ProductsObserver';

export function initializeContainer() {
    const container = new Container();
    decorate(injectable(), Typegoose);

// Models
    container.bind(User).toSelf();
    container.bind(Product).toSelf();
    container.bind(DiscussionPost).toSelf();

// Respositories
    container.bind(UsersRepository).to(MongoDBBasedUsersRepository);
    container.bind(ProductsRepository).to(MongoDBBasedProductsRepository);
    container.bind(DiscussionPostsRepository).to(MongoDBBasedDiscussionPostsRepository);

// Services
    container.bind(MoreleParser).toSelf();
    container.bind(ProductsObserver).toSelf();
    container.bind(EmailSender).toSelf();
    return container;
}
