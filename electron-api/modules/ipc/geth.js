
const { ipcMain } = require('electron');
const GethConnector = require('../services/geth/index.js');
const { STATICS } = require('../settings');
const { EVENTS } = require('../settings');

const symbolEnforcer = Symbol();
const symbol = Symbol();

/**
 * GethService class
 * It provides the View layer with access to geth instance.
 * It also registers events for the View layer, in order for the View layer
 * to be notified of what happens on the blockchain.
 *
 */
class GethService {
    /*
     * This is called from the getInstance function.
     * It shouldn't be called from any other place with new GethService
     * @param {Symbol} enforcer
     * @returns {GethService}
     */
    constructor (enforcer) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }
        this.serverEvent = EVENTS.server.geth;
        this.clientEvent = EVENTS.client.geth;
        this.BLOCK_UPDATE_INTERVAL = 1000;
        this.STARTSYNC_MSG = 'Start synchronizing with the network';
        this.ALREADY_RUNNING = 'Geth is already running';
    }
    /**
     * Makes sure it returns the same reference to a GethService instance
     * This must be used in order to get a GethService instance
     * @returns {GethService}
     */
    static getInstance () {
        if (!this[symbol]) {
            this[symbol] = new GethService(symbolEnforcer);
        }
        return this[symbol];
    }
    /*
     * It sets up the listeners for this module.
     * Events used are:
     * server:geth:startService used by the View layer to start the geth executable
     *
     * @param {BrowserWindow} mainWindow -- ignored for now
     * @returns undefined
     */
    setupListeners () {
        ipcMain.on(this.serverEvent.startService, (event, arg) => {
            this._startGethService(event, arg);
        });
        ipcMain.on(this.serverEvent.stopUpdates, (event, arg) => {
            this._stopGethUpdates(event, arg);
        });
        ipcMain.on(this.serverEvent.getUpdates, (event, arg) => {
            this._getGethUpdates(event, arg);
        });
        ipcMain.on(this.serverEvent.stopService, (event, arg) => {
            this._stopGethService(event, arg);
        });
    }
    _sendEvent (event) {
        return (name, successCode, data) => {
            event.sender.send(name, {
                success: successCode,
                status: data
            });
        };
    }
    _startGethService (event, arg) {
        if (this.getGethService().isRunning()) {
            this._sendEvent(event)(this.clientEvent.startService, false, this.ALREADY_RUNNING);
        } else {
            this
                .getGethService()
                .start(this._formatOptions(arg))
                .then(
                    () => {
                        // data [the function parameter] instead of arg
                        // to see what geth says when starts
                        this._sendEvent(event)(this.clientEvent.startService,
                                                true,
                                                arg);
                        this._sendEvent(event)(this.clientEvent.startSyncing,
                                                true,
                                                this.STARTSYNC_MSG);

                        setTimeout(() => {
                            this._getGethUpdates(event, arg);
                        }, STATICS.GETH_SETPROVIDER_TIMEOUT + 1000);
                    })
                .catch((data) => {
                    this._sendEvent(event)(this.clientEvent.startService, false, data);
                });
        }
    }
    _stopGethService (event) {
        if (this.updatesFlag) {
            this._stopGethUpdates();
        }
        this.getGethService().stop();
        this._sendEvent(event)(this.clientEvent.stopService,
                                !this.getGethService().gethProcess,
                                null);
    }
    _getGethUpdates (event) {
        this.updatesFlag = setInterval(() => this._getBlockUpdates(event),
            this.BLOCK_UPDATE_INTERVAL);
    }
    _stopGethUpdates () {
        clearInterval(this.updatesFlag);
        this.updatesFlag = false;
    }
    getGethService () {
        return GethConnector.getInstance();
    }
    _getBlockUpdates (event) {
        this
            .getGethService()
            .inSync()
            .then((data) => {
                let message = 'empty';
                if (data.length > 0) {
                    message = {
                        currentBlock: data.length > 1 ? data[1].currentBlock : -1,
                        highestBlock: data.length > 1 ? data[1].highestBlock : -1,
                        startingBlock: data.length > 1 ? data[1].startingBlock : -1,
                        peerCount: data[0]
                    };
                }
                if (!this.prevMessage) {
                    this.prevMessage = message;
                } else {
                    const msgIsString = typeof message === 'string';
                    const prev = typeof this.prevMessage === 'string';
                    const msg = msgIsString ? message : JSON.stringify(this.message);
                    const prevString = prev ? this.prevMessage : JSON.stringify(this.prevMessage);
                    if (prevString != msg) { // eslint-disable-line eqeqeq
                        this._sendEvent(event)(this.clientEvent.syncUpdate, true, message);
                    }
                    this.prevMessage = message;
                }
            })
        .catch(() => {
            this._stopGethUpdates();
        });
    }

    _formatOptions (options) {
        const opts = Object.assign({}, options);
        if (opts.cache) {
            const cacheValue = parseInt(opts.cache, 10);
            if (!isNaN(cacheValue)) {
                opts.protocol = ['--shh', '--fast', '--cache', cacheValue];
            }
            delete opts.cache;
        }
        return opts;
    }
}

export default GethService;
