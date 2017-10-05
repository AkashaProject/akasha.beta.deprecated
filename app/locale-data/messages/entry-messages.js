import { defineMessages } from 'react-intl';

const entryMessages = defineMessages({
    alreadyClaimed: {
        id: 'app.entry.alreadyClaimed',
        description: 'claim button tooltip when it was already claimed',
        defaultMessage: 'Already claimed'
    },
    alreadyVoted: {
        id: 'app.entry.alreadyVoted',
        description: 'vote button tooltip when it was already voted',
        defaultMessage: 'You have already voted on this entry'
    },
    blockNr: {
        id: 'app.entry.blockNr',
        description: 'block number',
        defaultMessage: 'Block {blockNr}'
    },
    claim: {
        id: 'app.entry.claim',
        description: 'claim button tooltip',
        defaultMessage: 'Claim'
    },
    commentsCount: {
        id: 'app.entry.commentsCount',
        description: 'Number of comments',
        defaultMessage: `{count, number} {count, plural,
            one {comment}
            few {comments}
            many {comments}
            other {comments}
        }`
    },
    downvote: {
        id: 'app.entry.downvote',
        description: 'downvote button tooltip',
        defaultMessage: 'Downvote'
    },
    entriesCount: {
        id: 'app.entry.entriesCount',
        description: 'counting entries',
        defaultMessage: `{count, number} {count, plural,
            one {entry}
            other {entries}
        }`
    },
    publicDiscussion: {
        id: 'app.entry.publicDiscussion',
        description: 'entry comments section title',
        defaultMessage: 'Public discussion'
    },
    published: {
        id: 'app.entry.published',
        description: 'published',
        defaultMessage: 'Published'
    },
    saveHighlight: {
        id: 'app.entry.saveHighlight',
        description: 'save highlight button label',
        defaultMessage: 'Save highlight'
    },
    showLess: {
        id: 'app.entry.showLess',
        description: 'label for comment collapse button',
        defaultMessage: 'Show less'
    },
    showMore: {
        id: 'app.entry.showMore',
        description: 'label for comment expand button',
        defaultMessage: 'Show more'
    },
    startComment: {
        id: 'app.entry.startComment',
        description: 'button label for starting a comment from a highlight',
        defaultMessage: 'Start comment'
    },
    wordsCount: {
        id: 'app.entry.wordsCount',
        description: 'number of words in an entry',
        defaultMessage: `{words, number} {words, plural,
                one {word}
                few {words}
                many {words}
                other {words}
            }`
    },
    readTime: {
        id: 'app.entry.readTime',
        description: 'estimated time to read an entry',
        defaultMessage: 'read'
    },
    writeComment: {
        id: 'app.entry.writeComment',
        description: 'placeholder for writing a comment',
        defaultMessage: 'Write a comment'
    },
    writeReplyTo: {
        id: 'app.entry.writeReplyTo',
        description: 'placeholder for writing a reply to someone {name}',
        defaultMessage: 'Write a reply to {name}'
    },
    loadingComments: {
        id: 'app.entry.loadingComments',
        description: 'message when loading comments for the first time',
        defaultMessage: 'Loading comments'
    },
    newComments: {
        id: 'app.entry.newComments',
        description: 'Message to show when new comments were published',
        defaultMessage: `{count, number} new {count, plural,
            one {comment}
            few {comments}
            many {comments}
            other {comments}
        }`
    },
    versionHistory: {
        id: 'app.entry.versionHistory',
        description: 'version history dialog title',
        defaultMessage: 'Version history'
    },
    versionNumber: {
        id: 'app.entry.versionNumber',
        description: 'label for version number',
        defaultMessage: 'Version {index}'
    },
    votePercentage: {
        id: 'app.entry.votePercentage',
        description: '',
        defaultMessage: 'Upvotes - {upvote}% · Downvotes - {downvote}%'
    },
    originalVersion: {
        id: 'app.entry.originalVersion',
        description: 'label for original version',
        defaultMessage: 'Original'
    },
    localVersion: {
        id: 'app.entry.localVersion',
        description: 'label for local version',
        defaultMessage: 'Local version'
    },
    continueEditing: {
        id: 'app.entry.continueEditing',
        description: 'label for continue editing button',
        defaultMessage: 'Continue editing'
    },
    editEntry: {
        id: 'app.entry.editEntry',
        description: 'tooltip for Edit entry button',
        defaultMessage: 'Edit entry'
    },
    cannotEdit: {
        id: 'app.entry.cannotEdit',
        description: 'tooltip for disabled Edit entry button',
        defaultMessage: 'This entry can no longer be edited'
    },
    version: {
        id: 'app.entry.version',
        description: 'entry version',
        defaultMessage: 'version'
    },
    olderVersion: {
        id: 'app.entry.olderVersion',
        description: 'entry subtitle for reading older versions',
        defaultMessage: 'You are now viewing an older'
    },
    noEntries: {
        id: 'app.entry.noEntries',
        description: 'placeholder for empty entry list',
        defaultMessage: 'No entries'
    },
    noNewEntries: {
        id: 'app.entry.noNewEntries',
        description: 'placeholder for empty latest entries list',
        defaultMessage: 'No new entries'
    },
    noVotes: {
        id: 'app.entry.noVotes',
        description: 'Placeholder for empty votes list',
        defaultMessage: 'No votes'
    },
    searchProfile: {
        id: 'app.entry.searchProfile',
        description: 'placeholder for profile column',
        defaultMessage: 'Search for a profile'
    },
    searchTag: {
        id: 'app.entry.searchTag',
        description: 'placeholder for tag column',
        defaultMessage: 'Search for a tag'
    },
    unresolvedComment: {
        id: 'app.entry.unresolvedComment',
        description: 'Message to display when a comment could not be resolved',
        defaultMessage: 'There are no peers online right now.'
    },
    unresolvedEntry: {
        id: 'app.entry.unresolvedEntry',
        description: 'Message to display when an entry could not be resolved',
        defaultMessage: 'There are no peers online right now.'
    },
    upvote: {
        id: 'app.entry.upvote',
        description: 'upvote button tooltip',
        defaultMessage: 'Upvote'
    },
    votePending: {
        id: 'app.entry.votePending',
        description: 'tooltip for vote button in pending state',
        defaultMessage: 'Your vote is pending'
    }
});
export { entryMessages };
