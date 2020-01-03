import {DiscussionPost} from '../../App/APIModels/DiscussionPost/DiscussionPost';

export abstract class DiscussionPostsRepository {
    abstract async getAll(): Promise<DiscussionPost[] | null>;
    abstract async store(user: DiscussionPost): Promise<void>;
}
