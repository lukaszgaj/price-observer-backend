import express from 'express';
import {controller, httpGet, httpPost, principal, request, response} from 'inversify-express-utils';
import {ProductsRepository} from '../../Domain/Repositories/ProductsRepository';
import {Principal} from '../../Infrastructure/Auth/Principal';
import {checkAuthentication} from '../Utils/checkAuthentication';
import {DiscussionPostsRepository} from "../../Domain/Repositories/DiscussionPostsRepository";
import {plainToClass} from "class-transformer";
import {User} from "../APIModels/User/User";
import {DiscussionPost} from "../APIModels/DiscussionPost/DiscussionPost";

const path = '/discussion';

@controller(path)
export class DiscussionPanelController {
    constructor(
        private postsRepository: DiscussionPostsRepository,
    ) {
    }

    @httpGet('/all')
    async getAll(
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        await checkAuthentication(authPrincipal);
        const posts = await this.postsRepository.getAll();
        res.status(200).json({posts});
    }

    @httpPost('/add')
    async add(
        @request() req: express.Request,
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        await checkAuthentication(authPrincipal);
        const normalizedBody = plainToClass(DiscussionPost, req.body);
        await this.postsRepository.store(normalizedBody);
        res.status(200).json({message: 'STORED_SUCCESSFULLY'});
    }
}
