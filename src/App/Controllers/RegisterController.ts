import {plainToClass} from 'class-transformer';
import express from 'express';
import {controller, httpPost, request, response} from 'inversify-express-utils';
import {ApiOperationPost, ApiPath} from 'swagger-express-ts';
import {UsersRepository} from '../../Domain/Repositories/UsersRepository';
import {User} from '../APIModels/User/User';

const path = '/register';

@ApiPath({
    name: 'Register user',
    path,
})
@controller(path)
export class RegisterController {
    constructor(
        private usersRepository: UsersRepository,
    ) {
    }

    @ApiOperationPost({
        description: '',
        parameters: {
            body: {
                description: 'User data',
                model: User.TYPE,
                required: true,
            },
        },
        path: '/',
        responses: {
            200: {description: 'OK'},
        },
    })
    @httpPost('/')
    async store(
        @request() req: express.Request,
        @response() res: express.Response,
    ) {
        const normalizedBody = plainToClass(User, req.body);
        if (!normalizedBody.name || !normalizedBody.email || !normalizedBody.password) {
            res.status(400).json({message: 'PLEASE_PROVIDE_VALID_DATA'});
            return;
        }
        if (await this.usersRepository.getUserByEmail(normalizedBody.email)) {
            res.status(400).json({message: 'USER_ALREADY_EXISTS'});
            return;
        }
        if (await this.usersRepository.getUserByName(normalizedBody.name)) {
            res.status(400).json({message: 'USER_ALREADY_EXISTS'});
            return;
        }
        this.usersRepository.store(normalizedBody);
        res.status(200).json({message: 'STORED_SUCCESSFULLY'});
    }
}
