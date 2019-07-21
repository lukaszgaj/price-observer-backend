import express from 'express';
import {controller, httpGet, interfaces, response} from 'inversify-express-utils';
import {ApiOperationGet, ApiPath} from 'swagger-express-ts';

@ApiPath({
    name: 'Default controller',
    path: '/',
})
@controller('/')
export class DefaultController implements interfaces.Controller {
    @ApiOperationGet({
        description: 'Route from / to /api-docs/swagger',
        responses: {
            200: {description: 'OK'},
        },
        security: {
            apiKeyHeader: [],
        },
    })
    @httpGet('/')
    index(@response() res: express.Response) {
        res.redirect('/api-docs/swagger');
    }
}
