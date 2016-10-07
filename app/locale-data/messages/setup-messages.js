import { defineMessages } from 'react-intl';

const setupMessages = defineMessages({
    changeGethDataDir: {
        id: 'app.setup.changeGethDataDir',
        description: 'Label for changing geth data directory',
        defaultMessage: 'Change this if geth has different data directory'
    },
    gethDataDirPath: {
        id: 'app.setup.gethDataDirPath',
        description: 'geth datadir path field label',
        defaultMessage: 'Geth Datadir path'
    },
    changeGethAlreadyStarted: {
        id: 'app.setup.changeGethAlreadyStarted',
        description: 'input field placeholder text',
        defaultMessage: 'Change this if geth is already started with --ipcpath'
    },
    gethIPCPath: {
        id: 'app.setup.gethIPCPath',
        description: 'geth ipc path input placeholder',
        defaultMessage: 'Geth IPC Path'
    },
    gethCacheSize: {
        id: 'app.setup.gethCacheSize',
        description: 'geth cache size input placeholder',
        defaultMessage: 'Geth cache size'
    },
    changeIfIpfsRunning: {
        id: 'app.setup.changeIfIpfsRunning',
        description: 'ipfs input field placeholder',
        defaultMessage: 'Change this if ipfs daemon is already running'
    },
    changeGethCacheSize: {
        id: 'app.setup.changeGethCacheSize',
        description: 'geth cache size input label',
        defaultMessage: 'Change Geth cache size (min. 512MB)'
    },
    gethCacheSizeError: {
        id: 'app.setup.gethCacheSizeError',
        description: 'error shown when user sets a cache size lower than 512mb',
        defaultMessage: 'Cache size should not be less than 512Mb'
    },
    ipfsApiPort: {
        id: 'app.setup.ipfsApiPort',
        description: 'ipfs input field label',
        defaultMessage: 'IPFS API port'
    },
    ipfsGatewayPort: {
        id: 'app.setup.ipfsGatewayPort',
        description: 'ipfs input field label',
        defaultMessage: 'IPFS gateway port'
    },
    firstTimeSetupTitle: {
        id: 'app.setup.firstTimeSetupTitle',
        description: 'title for first time setup page',
        defaultMessage: 'First time setup'
    },
    akashaNextGenNetwork: {
        id: 'app.setup.akashaNextGenNetwork',
        description: 'akasha next gen description',
        defaultMessage: `AKASHA is a next-generation social blogging network powered by a new
                        kind of world computers known as Ethereum and the
                        Inter Planetary File System.`
    },
    youHaveNotHeared: {
        id: 'app.setup.youHavenNotHeared',
        description: 'You have not heard about these :)',
        defaultMessage: `If you haven’t heard of these technologies before don’t worry, simply
                        click next and we’ll take care of the rest.`
    },
    ifYouHaveEth: {
        id: 'app.setup.ifYouHaveEth',
        description: 'if you already have Ethereum',
        defaultMessage: `If you already have the Ethereum Go client or IPFS installed on your
                        machine please choose the advanced option.`
    },
    expressSetup: {
        id: 'app.setup.expressSetup',
        description: 'Express setup option checkbox',
        defaultMessage: 'Express setup'
    },
    advancedSetup: {
        id: 'app.setup.advancedSetup',
        description: 'Advanced setup option checkbox',
        defaultMessage: 'Advanced'
    },
    downloadingGeth: {
        id: 'app.setup.downloadingGeth',
        description: 'message shown when geth is downloading',
        defaultMessage: 'Downloading Geth client..'
    },
    downloadingIpfs: {
        id: 'app.setup.downloadingIpfs',
        description: 'message shown when IPFS is downloading',
        defaultMessage: 'Downloading IPFS client..'
    },
    startingGeth: {
        id: 'app.setup.startingGeth',
        description: 'message shown when Geth is starting',
        defaultMessage: 'Starting Geth client..'
    },
    processing: {
        id: 'app.setup.processing',
        description: 'message shown when processing blocks',
        defaultMessage: 'Processing'
    },
    synchronizing: {
        id: 'app.setup.synchronizing',
        description: 'state of block sync',
        defaultMessage: 'Synchronizing'
    },
    syncStopped: {
        id: 'app.setup.syncStopped',
        description: 'state of block sync',
        defaultMessage: 'Synchronization was stopped'
    },
    syncCompleted: {
        id: 'app.setup.syncCompleted',
        description: 'state of block sync',
        defaultMessage: 'Synchronization completed'
    },
    syncPaused: {
        id: 'app.setup.syncPaused',
        description: 'state of block sync',
        defaultMessage: 'Syncronization is paused'
    },
    syncResuming: {
        id: 'app.setup.syncResuming',
        description: 'state of block sync',
        defaultMessage: 'Resuming synchronization...'
    },
    disconnected: {
        id: 'app.setup.disconnected',
        description: 'disconnected',
        defaultMessage: 'Disconnected'
    },
    beforeSyncStart: {
        id: 'app.setup.beforeSyncStart',
        description: 'Message to show before sync is starting',
        defaultMessage: `We are starting synchronization with the Ethereum world computer.
                        Please be patient.`
    },
    onSyncStart: {
        id: 'app.setup.onSyncStart',
        description: 'Message to show when synchronizing',
        defaultMessage: `Your machine is currently synchronizing with the Ethereum world computer
                        network. You will be able to log in and enjoy the full AKASHA experience as
                        soon as the sync is complete.`
    },
    initializingTitle: {
        id: 'app.setup.initializingTitle',
        description: 'Title for initializing state page',
        defaultMessage: 'Initializing'
    },
    noProfilesFound: {
        id: 'app.setup.noProfilesFound',
        description: 'message if no local profiles found.',
        defaultMessage: 'No profiles found. Create a new identity or import an existing one.'
    },
    findingProfiles: {
        id: 'app.setup.findingProfiles',
        description: 'when we are trying to discover local profiles with akasha account',
        defaultMessage: 'Finding profiles..'
    },
    logInTitle: {
        id: 'app.setup.logInTitle',
        description: 'login page title',
        defaultMessage: 'Log in'
    },
    findingPeers: {
        id: 'app.setup.findingPeers',
        description: 'finding peers status',
        defaultMessage: 'Finding peers'
    },
    onePeer: {
        id: 'app.setup.onePeer',
        description: 'singular form of peers',
        defaultMessage: 'peer'
    },
    fewPeers: {
        id: 'app.setup.fewPeers',
        description: 'plural form of peer. depends on language',
        defaultMessage: 'peers'
    },
    manyPeers: {
        id: 'app.setup.manyPeers',
        description: 'in some languages there is another plural form of peers for many',
        defaultMessage: 'peers'
    },
    peers: {
        id: 'app.setup.peers',
        description: 'base plural form of peer',
        defaultMessage: 'peers'
    },
    hideDetails: {
        id: 'app.setup.hideDetails',
        description: 'hide geth logs',
        defaultMessage: 'Hide details'
    },
    viewDetails: {
        id: 'app.setup.viewDetails',
        description: 'show geth logs',
        defaultMessage: 'View details'
    },
    retry: {
        id: 'app.setup.retry',
        description: 'try again',
        defaultMessage: 'Retry'
    }
});

export { setupMessages };
