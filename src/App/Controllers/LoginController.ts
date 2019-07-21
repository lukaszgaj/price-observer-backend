import {plainToClass} from 'class-transformer';
import express from 'express';
import {controller, httpPost, request, response} from 'inversify-express-utils';
import {ApiOperationPost, ApiPath} from 'swagger-express-ts';
import {UsersRepository} from '../../Domain/Repositories/UsersRepository';
import {RegisteredUser} from '../APIModels/RegisteredUser/RegisteredUser';
import {compareSync} from 'bcrypt';
import {generateToken} from '../Utils/generateToken';

const path = '/login';

@ApiPath({
    name: 'Login user',
    path,
})
@controller(path)
export class LoginController {
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
        path: '/',
        responses: {
            200: {description: 'OK'},
        },
    })
    @httpPost('/')
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
            const token = generateToken(user._id);
            res.status(200).json({data: {token}});
        } else {
            res.status(400).json({message: 'BAD_EMAIL_OR_PASSWORD'});
        }
    }
}
