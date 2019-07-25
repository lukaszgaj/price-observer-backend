import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import {Container, decorate, injectable} from 'inversify';
import {InversifyExpressServer} from 'inversify-express-utils';
import mongoose from 'mongoose';
import logger from 'morgan';
import {SwaggerDefinitionConstant} from 'swagger-express-ts';
import * as swagger from 'swagger-express-ts';
import {Typegoose} from 'typegoose';
import './config/controllers';
import {Product} from './src/App/APIModels/Product/Product';
import {User} from './src/App/APIModels/User/User';
import {ProductsRepository} from './src/Domain/Repositories/ProductsRepository';
import {UsersRepository} from './src/Domain/Repositories/UsersRepository';
import {JWTBasedAuthProvider} from './src/Infrastructure/Auth/JWTBasedAuthProvider';
import {MongoDBBasedProductsRepository} from './src/Infrastructure/Repositories/MongoDBBasedProductsRepository';
import {MongoDBBasedUsersRepository} from './src/Infrastructure/Repositories/MongoDBBasedUsersRepository';

const container = new Container();
decorate(injectable(), Typegoose);

// Models
container.bind(User).toSelf();
container.bind(Product).toSelf();

// Respositories
container.bind(UsersRepository).to(MongoDBBasedUsersRepository);
container.bind(ProductsRepository).to(MongoDBBasedProductsRepository);

if (!process.env.CONNECTION_URL) {
    throw new Error('Cannot find CONNECTION_URL');
}
mongoose.connect(
    process.env.CONNECTION_URL,
    {useNewUrlParser: true},
)
    .then(() => void 0);
mongoose.connection.on(
    'error',
    console.error.bind(console, 'MongoDB connection error:',
    ));
mongoose.set('useFindAndModify', false);
const expressApp = express();
expressApp.use(cors());
expressApp.use(helmet());
expressApp.use(logger('dev'));

expressApp.use('/api-docs/swagger', express.static('resources/swagger'));
expressApp.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
expressApp.use(swagger.express({
    definition: {
        info: {
            title: 'Price observer backend API',
            version: require('./package.json').version,
        },
        schemes: [
            SwaggerDefinitionConstant.Scheme.HTTP,
        ],
        securityDefinitions: {
            apiKeyHeader: {
                in: SwaggerDefinitionConstant.Security.In.HEADER,
                name: 'Authorization',
                type: SwaggerDefinitionConstant.Security.Type.API_KEY,
            },
        },
    },
}));

expressApp.use(express.urlencoded({extended: false}));
expressApp.use(express.json());

new InversifyExpressServer(
    container,
    null,
    null,
    expressApp,
    JWTBasedAuthProvider,
).build()
    .listen(8000, () => {
        console.log('Listening on port 8000');
    });
