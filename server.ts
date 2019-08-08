import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import {InversifyExpressServer} from 'inversify-express-utils';
import mongoose from 'mongoose';
import logger from 'morgan';
import * as swagger from 'swagger-express-ts';
import {SwaggerDefinitionConstant} from 'swagger-express-ts';
import './config/controllers';
import {initializeContainer} from './src/config/inversify.config';
import {JWTBasedAuthProvider} from './src/Infrastructure/Auth/JWTBasedAuthProvider';
import {ProductsObserver} from './src/Infrastructure/Services/getPriceNotificationEmailOptions.ts/ProductsObserver';

if (!process.env.CONNECTION_URL) {
    throw new Error('Cannot find CONNECTION_URL');
}
const container = initializeContainer();
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

//const mailOptions = getResetPasswordEmailOptions('Alert Cenowy', process.env.GMAIL_ADDRESS!, '', '', 'asdad');
//sendEmail(mailOptions);

setInterval(async () => {
    await container.get(ProductsObserver).monitorProducts();
}, 5000);

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
