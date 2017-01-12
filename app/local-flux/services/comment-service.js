import BaseService from './base-service';

const Channel = window.Channel;


class CommentService extends BaseService {

    getEntryComments = ({ entryId, start, limit, reverse, onSuccess, onError }) =>
        this.openChannel({
            clientManager: Channel.client.comments.manager,
            serverChannel: Channel.server.comments.commentsIterator,
            clientChannel: Channel.client.comments.commentsIterator,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            const payload = {
                entryId, limit, reverse
            };
            if (start) {
                payload.start = start;
            }
            Channel.server.comments.commentsIterator.send(payload);
        });

    getCommentsCount = ({ entryId, onSuccess, onError }) =>
        this.openChannel({
            clientManager: Channel.client.comments.manager,
            serverChannel: Channel.server.comments.commentsCount,
            clientChannel: Channel.client.comments.commentsCount,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.comments.commentsCount.send({ entryId });
        });

    publishComment = ({ onSuccess, onError, ...payload }) => {
        this.registerListener(
            Channel.client.comments.comment,
            this.createListener(onError, onSuccess)
        );
        Channel.server.comments.comment.send(payload);
    }
}
export { CommentService };
