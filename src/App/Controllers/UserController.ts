import {compareSync} from 'bcrypt';
import {plainToClass} from 'class-transformer';
import express from 'express';
import {controller, httpPost, request, response} from 'inversify-express-utils';
import {ApiOperationPost, ApiPath} from 'swagger-express-ts';
import {UsersRepository} from '../../Domain/Repositories/UsersRepository';
import {RegisteredUser} from '../APIModels/RegisteredUser/RegisteredUser';
import {generateToken} from '../Utils/generateToken';
import {User} from '../APIModels/User/User';

const path = '/user';

@ApiPath({
    name: 'User',
    path,
})
@controller(path)
export class UserController {
    constructor(
        private usersRepository: UsersRepository,
    ) {
    }

    @ApiOperationPost({
        description: 'Login user',
        parameters: {
            body: {
                description: 'RegisteredUser data',
                model: RegisteredUser.TYPE,
                required: true,
            },
        },
        path: '/authenticate',
        responses: {
            200: {description: 'OK'},
        },
    })
    @httpPost('/authenticate')
    async authenticate(
        @request() req: express.Request,
        @response() res: express.Response,
    ) {
        const normalizedBody = plainToClass(RegisteredUser, req.body);
        if (!normalizedBody.email || !normalizedBody.password) {
            res.status(400).json({message: 'PLEASE_PROVIDE_VALID_DATA'});
            return;
        }
        const user = await this.usersRepository.getUserByEmail(normalizedBody.email);
        if (!user) {
            res.status(400).json({message: 'USER_DOES_NOT_EXIST'});
            return;
        }
        if (compareSync(normalizedBody.password, user.password)) {
            const token = generateToken(user._id, user.email, user.name);
            res.status(200).json({token});
        } else {
            res.status(400).json({message: 'BAD_EMAIL_OR_PASSWORD'});
        }
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
        path: '/register',
        responses: {
            200: {description: 'OK'},
        },
    })
    @httpPost('/register')
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
            res.status(409).json({message: 'USER_ALREADY_EXISTS'});
            return;
        }
        if (await this.usersRepository.getUserByName(normalizedBody.name)) {
            res.status(409).json({message: 'USER_ALREADY_EXISTS'});
            return;
        }
        await this.usersRepository.store(normalizedBody);
        res.status(200).json({message: 'STORED_SUCCESSFULLY'});
    }
}
