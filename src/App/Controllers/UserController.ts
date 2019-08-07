import {compareSync, hashSync} from 'bcrypt';
import {plainToClass} from 'class-transformer';
import express from 'express';
import {controller, httpPost, principal, request, response} from 'inversify-express-utils';
import {ApiOperationPost, ApiPath} from 'swagger-express-ts';
import {UsersRepository} from '../../Domain/Repositories/UsersRepository';
import {RegisteredUser} from '../APIModels/RegisteredUser/RegisteredUser';
import {generateToken} from '../Utils/generateToken';
import {User} from '../APIModels/User/User';
import {getResetPasswordEmailOptions, sendEmail} from '../../Infrastructure/Services/MonitorProducts';
import {Principal} from '../../Infrastructure/Auth/Principal';
import {checkAuthentication} from '../Utils/checkAuthentication';
import {ResetPasswordRequest} from '../APIModels/User/ResetPasswordRequest';

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
            res.status(409).json({message: 'USER_WITH_THIS_EMAIL_ALREADY_EXISTS'});
            return;
        }
        if (await this.usersRepository.getUserByName(normalizedBody.name)) {
            res.status(409).json({message: 'USER_WITH_THIS_NAME_ALREADY_EXISTS'});
            return;
        }
        await this.usersRepository.store(normalizedBody);
        res.status(200).json({message: 'STORED_SUCCESSFULLY'});
    }

    @httpPost('/reset-password')
    async resetPassword(
        @request() req: express.Request,
        @response() res: express.Response,
    ) {
        const normalizedBody = plainToClass(User, req.body);
        if (!normalizedBody.email) {
            res.status(400).json({message: 'PLEASE_PROVIDE_VALID_DATA'});
            return;
        }

        const user = await this.usersRepository.getUserByEmail(normalizedBody.email);

        if (!user) {
            res.status(409).json({message: 'USER_WITH_THIS_EMAIL_DOES_NOT_EXIST'});
            return;
        }

        const newPassw = Math.random().toString(36).substr(2, 10);

        const senderMailAddress = process.env.GMAIL_ADDRESS;
        if (senderMailAddress) {
            user.password = hashSync(newPassw, 10);
            await this.usersRepository.update(user);
            const mailOptions = getResetPasswordEmailOptions('Alert Cenowy', senderMailAddress, user, newPassw);
            await sendEmail(mailOptions);
            res.status(409).json({message: 'PASSWORD_CHANGED'});
        } else {
            res.status(500).json('CANNOT_FIND_SENDER_EMAIL_ADDRESS');
            return;
        }
    }

    @httpPost('/change-password')
    async changePassword(
        @request() req: express.Request,
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        await checkAuthentication(authPrincipal);
        const normalizedBody = plainToClass(ResetPasswordRequest, req.body);
        if (!normalizedBody.currentPassword || !normalizedBody.newPassword) {
            res.status(400).json({message: 'PLEASE_PROVIDE_VALID_DATA'});
            return;
        }

        const userFromDB = await this.usersRepository.getUserById(authPrincipal.getDetails().userId.toString());

        if (!userFromDB) {
            res.status(409).json({message: 'USER_WITH_THIS_EMAIL_DOES_NOT_EXIST'});
            return;
        }

        if (compareSync(normalizedBody.currentPassword, userFromDB.password)) {
            userFromDB.password = hashSync(normalizedBody.newPassword, 10);
            if (await this.usersRepository.update(userFromDB))
                res.status(200).json({message: 'PASSWORD_CHANGED_SUCCESSFULLY'});
            else  res.status(500).json({message: 'DATABASE_ERROR'});
        } else {
            res.status(400).json({message: 'INVALID_PASSWORD'});
        }
    }
}
