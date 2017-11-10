import { defineMessages } from 'react-intl';

// keep this sorted alphabetically
const generalMessages = defineMessages({
    abort: {
        id: 'app.general.abort',
        description: 'abort button label',
        defaultMessage: 'Abort'
    },
    action: {
        id: 'app.general.action',
        description: 'action',
        defaultMessage: 'Action'
    },
    add: {
        id: 'app.general.add',
        description: 'add',
        defaultMessage: 'Add'
    },
    addImage: {
        id: 'app.general.addImage',
        description: 'placeholder for image uploader component',
        defaultMessage: 'Drag and drop to add an image.'
    },
    addImageDragged: {
        id: 'app.general.addImageDragged',
        description: 'message to show when user is dragging an image over',
        defaultMessage: 'Cool! Drop it just here!'
    },
    addNewEntry: {
        id: 'app.general.addNewEntry',
        description: 'tooltip for sidebar add entry button',
        defaultMessage: 'Add new entry'
    },
    aeth: {
        id: 'app.general.aeth',
        description: 'aeth token',
        defaultMessage: 'AETH'
    },
    amount: {
        id: 'app.general.amount',
        description: 'currency amount',
        defaultMessage: 'Amount'
    },
    akasha: {
        id: 'app.general.akasha',
        description: 'AKASHA',
        defaultMessage: 'AKASHA'
    },
    back: {
        id: 'app.general.back',
        description: 'navigate back',
        defaultMessage: 'Back'
    },
    block: {
        id: 'app.general.block',
        description: 'block number',
        defaultMessage: 'Block'
    },
    cancel: {
        id: 'app.general.cancel',
        description: 'cancel button label',
        defaultMessage: 'Cancel'
    },
    chat: {
        id: 'app.general.chat',
        description: 'tooltip for sidebar chat button',
        defaultMessage: 'Chat'
    },
    chooseImage: {
        id: 'app.general.chooseImage',
        description: 'tooltip to show when user hovers image uploader component and no image selected',
        defaultMessage: 'Choose an image'
    },
    chooseAnotherImage: {
        id: 'app.general.chooseAnotherImage',
        description: 'tooltip to show when user hovers image uploader and an image is already selected',
        defaultMessage: 'Choose another image'
    },
    close: {
        id: 'app.general.close',
        description: 'close',
        defaultMessage: 'Close'
    },
    collect: {
        id: 'app.general.collect',
        description: 'collect',
        defaultMessage: 'Collect'
    },
    completeProfileCrumb: {
        id: 'app.general.completeProfileCrumb',
        description: 'breadcrumb to display when a profile is created',
        defaultMessage: 'Complete Profile'
    },
    confirm: {
        id: 'app.general.confirm',
        description: 'confirm button label',
        defaultMessage: 'Confirm'
    },
    copy: {
        id: 'app.general.copy',
        description: 'copy',
        defaultMessage: 'Copy'
    },
    counter: {
        id: 'app.general.counter',
        description: 'counter',
        defaultMessage: 'Counter'
    },
    create: {
        id: 'app.general.create',
        description: 'Create button label',
        defaultMessage: 'Create'
    },
    created: {
        id: 'app.general.created',
        description: 'created',
        defaultMessage: 'Created'
    },
    cycling: {
        id: 'app.general.cycling',
        description: 'AETH cycling state',
        defaultMessage: 'Cycling'
    },
    delete: {
        id: 'app.general.delete',
        description: 'Delete something button label',
        defaultMessage: 'Delete'
    },
    downloading: {
        id: 'app.general.downloading',
        description: 'service status',
        defaultMessage: 'Downloading'
    },
    edit: {
        id: 'app.general.edit',
        description: 'Edit something button label',
        defaultMessage: 'Edit'
    },
    editProfile: {
        id: 'app.general.editProfile',
        description: 'Edit profile button label',
        defaultMessage: 'Edit profile'
    },
    essence: {
        id: 'app.general.essence',
        description: 'essence',
        defaultMessage: 'Essence'
    },
    essenceTotalScore: {
        id: 'app.general.essenceTotalScore',
        description: 'essence total score',
        defaultMessage: 'Essence total score'
    },
    eth: {
        id: 'app.general.eth',
        description: 'ether symbol',
        defaultMessage: 'ETH'
    },
    ethereumAddress: {
        id: 'app.general.ethereumAddress',
        description: 'Placeholder for ethereum address field. Not sure if Ethereum should be translated',
        defaultMessage: 'Ethereum Address'
    },
    generatingPreview: {
        id: 'app.general.generatingPreview',
        description: 'placeholder to show while an image preview is being generated',
        defaultMessage: 'Generating preview'
    },
    gethServiceOff: {
        id: 'app.general.gethServiceOff',
        description: 'geth client service is stopped',
        defaultMessage: 'Geth service OFF'
    },
    gethServiceOn: {
        id: 'app.general.gethServiceOn',
        description: 'geth client service is started',
        defaultMessage: 'Geth service ON'
    },
    help: {
        id: 'app.general.help',
        description: 'Help button label',
        defaultMessage: 'Help'
    },
    history: {
        id: 'app.general.history',
        description: 'transactions history',
        defaultMessage: 'History'
    },
    hoursCount: {
        id: 'app.general.hoursCount',
        description: 'hours count',
        defaultMessage: `{hours, number} {hours, plural,
            one {hour}
            other {hours}
        }`
    },
    ipfsServiceOff: {
        id: 'app.general.ipfsServiceOff',
        description: 'ipfs client service is stopped',
        defaultMessage: 'IPFS service OFF'
    },
    ipfsServiceOn: {
        id: 'app.general.ipfsServiceOn',
        description: 'ipfs client service is started',
        defaultMessage: 'IPFS service ON'
    },
    join: {
        id: 'app.general.join',
        description: 'join button label',
        defaultMessage: 'Join'
    },
    karma: {
        id: 'app.general.karma',
        description: 'karma',
        defaultMessage: 'Karma'
    },
    karmaTotalScore: {
        id: 'app.general.karmaTotalScore',
        description: 'karma total score',
        defaultMessage: 'Karma total score'
    },
    leave: {
        id: 'app.general.leave',
        description: 'leave button label',
        defaultMessage: 'Leave'
    },
    logs: {
        id: 'app.general.logs',
        description: 'Services logs',
        defaultMessage: 'Logs'
    },
    logout: {
        id: 'app.general.logout',
        description: 'Logout button label',
        defaultMessage: 'Logout'
    },
    mana: {
        id: 'app.general.mana',
        description: 'mana',
        defaultMessage: 'Mana'
    },
    manafied: {
        id: 'app.general.manafied',
        description: 'AETH manafied/bonded state',
        defaultMessage: 'Manafied'
    },
    minCount: {
        id: 'app.general.minutesCount',
        description: 'short form of minutes count',
        defaultMessage: '{minutes, number} min'
    },
    myEntries: {
        id: 'app.general.myEntries',
        description: 'tooltip for sidebar my entries button',
        defaultMessage: 'My entries'
    },
    next: {
        id: 'app.general.next',
        description: 'Label for Next button',
        defaultMessage: 'Next'
    },
    no: {
        id: 'app.general.no',
        description: 'no (for confirmations)',
        defaultMessage: 'No'
    },
    notes: {
        id: 'app.general.notes',
        description: 'notes',
        defaultMessage: 'Notes'
    },
    ok: {
        id: 'app.general.ok',
        description: 'Ok',
        defaultMessage: 'Ok'
    },
    pause: {
        id: 'app.general.pause',
        description: 'pause button label',
        defaultMessage: 'Pause'
    },
    pending: {
        id: 'app.general.pending',
        description: 'an action is pending',
        defaultMessage: 'Pending'
    },
    people: {
        id: 'app.general.people',
        description: 'tooltip for sidebar people button',
        defaultMessage: 'People'
    },
    processingImage: {
        id: 'app.general.processingImage',
        description: 'Message to show while images are being precessed',
        defaultMessage: 'Processing image'
    },
    profileOverview: {
        id: 'app.general.profileOverview',
        description: 'button label for profile overview',
        defaultMessage: 'Profile Overview'
    },
    publish: {
        id: 'app.general.publish',
        description: 'button label for publish action',
        defaultMessage: 'Publish'
    },
    refresh: {
        id: 'app.general.refresh',
        description: 'refresh/reload',
        defaultMessage: 'Refresh'
    },
    rename: {
        id: 'app.general.rename',
        description: 'rename',
        defaultMessage: 'Rename'
    },
    reply: {
        id: 'app.general.reply',
        description: 'reply',
        defaultMessage: 'Reply'
    },
    reset: {
        id: 'app.general.reset',
        description: 'Reset form',
        defaultMessage: 'Reset'
    },
    resume: {
        id: 'app.general.resume',
        description: 'resume button label',
        defaultMessage: 'Resume'
    },
    running: {
        id: 'app.general.running',
        description: 'service status',
        defaultMessage: 'Running'
    },
    save: {
        id: 'app.general.save',
        description: 'Save changes in a form',
        defaultMessage: 'Save'
    },
    saveForLater: {
        id: 'app.general.saveForLater',
        description: 'Save for later',
        defaultMessage: 'save for later'
    },
    search: {
        id: 'app.general.search',
        description: 'tooltip for sidebar search button',
        defaultMessage: 'Search'
    },
    send: {
        id: 'app.general.send',
        description: 'send button label',
        defaultMessage: 'Send'
    },
    settings: {
        id: 'app.general.settings',
        description: 'settings button label',
        defaultMessage: 'Settings'
    },
    shift: {
        id: 'app.general.shift',
        description: 'convert tokens',
        defaultMessage: 'Shift'
    },
    skipStep: {
        id: 'app.general.skipStep',
        description: 'label for skip button',
        defaultMessage: 'Skip this step'
    },
    start: {
        id: 'app.general.start',
        description: 'start button label',
        defaultMessage: 'Start'
    },
    starting: {
        id: 'app.general.starting',
        description: 'service status',
        defaultMessage: 'Starting'
    },
    stopped: {
        id: 'app.general.stopped',
        description: 'service status',
        defaultMessage: 'Stopped'
    },
    stream: {
        id: 'app.general.stream',
        description: 'tooltip for sidebar stream button',
        defaultMessage: 'Stream'
    },
    submit: {
        id: 'app.general.submit',
        description: 'submit button label',
        defaultMessage: 'Submit'
    },
    terms: {
        id: 'app.general.terms',
        description: `Terms agreement for account creation.
                        Do not translate {termsLink} and {privacyLink}!`,
        defaultMessage: `By proceeding to create your account and use AKASHA, you are agreeing to
                         our {termsLink}. If you do not agree, you cannot use
                         AKASHA.`
    },
    termsOfService: {
        id: 'app.general.termsOfService',
        description: 'Terms of Service and Privacy Policy',
        defaultMessage: 'Terms of Service and Privacy Policy'
    },
    transactionFailed: {
        id: 'app.general.transactionFailed',
        description: 'transaction has failed',
        defaultMessage: 'Transaction has failed'
    },
    transferable: {
        id: 'app.general.transferable',
        description: 'AETH transferable/free state',
        defaultMessage: 'Transferable'
    },
    transform: {
        id: 'app.general.transform',
        description: 'change the state of AETH tokens',
        defaultMessage: 'Transform'
    },
    update: {
        id: 'app.general.update',
        description: 'Update data',
        defaultMessage: 'Update'
    },
    upgrading: {
        id: 'app.general.upgrading',
        description: 'Upgrading services',
        defaultMessage: 'Upgrading'
    },
    vote: {
        id: 'app.general.vote',
        description: 'Vote',
        defaultMessage: 'Vote'
    },
    wallet: {
        id: 'app.general.wallet',
        description: 'wallet',
        defaultMessage: 'Wallet'
    },
    yes: {
        id: 'app.general.yes',
        description: 'yes (as a confirmation)',
        defaultMessage: 'Yes',
    }
});
export { generalMessages };
