import {injectable} from 'inversify';
import {DiscussionPost} from '../../App/APIModels/DiscussionPost/DiscussionPost';
import {DiscussionPostsRepository} from '../../Domain/Repositories/DiscussionPostsRepository';

@injectable()
export class MongoDBBasedDiscussionPostsRepository implements DiscussionPostsRepository {
    private discussionPostModel = this.post.getModelForClass(DiscussionPost);

    constructor(
        private post: DiscussionPost,
    ) {
    }

    async getAll(): Promise<DiscussionPost[] | null> {
        return await this.discussionPostModel.find()
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async store(post: DiscussionPost): Promise<void> {
        await this.discussionPostModel.create({
            post,
        }).then(res => {
            return res;
        }).catch(e => {
            console.log('Could not store post because of: ', e);
        });
    }
}