import { defineMessages } from 'react-intl';

const entryMessages = defineMessages({
    alreadyClaimed: {
        id: 'app.entry.alreadyClaimed',
        description: 'claim button tooltip when it was already claimed',
        defaultMessage: 'Already claimed'
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
    downvote: {
        id: 'app.entry.downvote',
        description: 'downvote button tooltip',
        defaultMessage: 'Downvote'
    },
    draft: {
        id: 'app.entry.draft',
        description: 'draft label indicator',
        defaultMessage: 'Draft'
    },
    draftCardSubtitle: {
        id: 'app.entry.draftCardSubtitle',
        description: 'subtitle showing last updated time and words number on draft card in new entry panel',
        defaultMessage: '{lastUpdate} - {wordCount} words so far'
    },
    entriesCount: {
        id: 'app.entry.entriesCount',
        description: 'counting entries',
        defaultMessage: `{count, number} {count, plural,
            one {entry}
            other {entries}
        }`
    },
    publishedBlockDiff: {
        id: 'app.entry.publishedBlockDiff',
        description: 'how many blocks ago was an entry published',
        defaultMessage: `Published {blockDiff, number} {blockDiff, plural,
                one {block}
                few {blocks}
                many {blocks}
                other {blocks}
            } ago`
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
    allComments: {
        id: 'app.entry.allComments',
        description: 'all comments section title',
        defaultMessage: 'ALL COMMENTS'
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
    loadingMoreComments: {
        id: 'app.entry.loadingMoreComments',
        description: 'message for loading more comments',
        defaultMessage: 'Loading more comments'
    },
    createdAt: {
        id: 'app.entry.createdAt',
        description: 'message to display when sorting something',
        defaultMessage: 'Created {createdAt}'
    },
    unresolvedEntry: {
        id: 'app.entry.unresolvedEntry',
        description: 'Message to display when an entry could not be resolved',
        defaultMessage: 'There are no peers online right now.'
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
    upvote: {
        id: 'app.entry.upvote',
        description: 'upvote button tooltip',
        defaultMessage: 'Upvote'
    },
    voteWeight: {
        id: 'app.entry.voteWeight',
        description: 'placeholder for vote weight input',
        defaultMessage: 'Vote weight'
    },
    votingExpired: {
        id: 'app.entry.votingExpired',
        description: 'upvote/downvote tooltip when voting period expired',
        defaultMessage: 'Voting period has ended'
    }
});
export { entryMessages };
