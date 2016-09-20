import { ipcRenderer } from 'electron';
import debug from 'debug';
import BaseService from './base-service';

const Channel = window.Channel;
const dbg = debug('App:GethService:');

/**
 * Default managed channels: [startService, stopService, status]
 */
class GethService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.geth.manager;
        this.clientManager = Channel.client.geth.manager;
    }
    /**
     * sends start Geth command to main process w/o options
     * @param {object} options Optional params
     * @return promise
     */
    start = ({ options = {}, dispatch, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.geth.startService;
        const clientChannel = Channel.client.geth.startService;
        const gethOptions = {};

        Object.keys(options).forEach((key) => {
            if (key !== 'name' && options[key] !== '') {
                gethOptions[key] = options[key];
            }
        });

        dbg('Retrieving Geth status', clientChannel);

        this.registerListener(clientChannel, this.createListener(dispatch, onError, onSuccess));
        ipcRenderer.send(serverChannel, gethOptions);
    };
    /**
     * Stop Geth process
     */
    stop = ({ options = {}, dispatch, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.geth.stopService;
        const clientChannel = Channel.client.geth.stopService;
        dbg('Stopping Geth service on channel:', clientChannel);
        this.registerListener(clientChannel, this.createListener(dispatch, onError, onSuccess));
        ipcRenderer.send(serverChannel, options);
    }
    /**
     * Restart Geth
     * @params timer? <Number> milliseconds to wait before starting again
     */
    restart = ({ options = { timer: 6000 }, dispatch, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.geth.restartService;
        const clientChannel = Channel.client.geth.restartService;

        return this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(dispatch, onError, onSuccess)
        }, () =>
            ipcRenderer.send(serverChannel, options)
            );
    };
    /**
     *  Retrieve Geth logs
     */
    getLogs = ({ options = {}, dispatch, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.geth.logs;
        const clientChannel = Channel.client.geth.logs;

        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(dispatch, onError, onSuccess)
        }, () =>
            ipcRenderer.send(serverChannel, options)
        );
    };
    /**
     *  Get current status of geth;
     *  @response data = {
     *      downloading?: boolean;
     *      starting?: boolean;
     *      api: boolean;
     *      spawned: boolean;
     *      started?: boolean;
     *      stopped?: boolean;
     *  }
     */
    getStatus = ({ options = {}, dispatch, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.geth.status;
        const clientChannel = Channel.client.geth.status;

        dbg('Retrieving Geth status', clientChannel);

        this.registerListener(clientChannel, this.createListener(dispatch, onError, onSuccess));
        ipcRenderer.send(serverChannel, options);
    }
    /**
     * Retrieve options used by geth
     */
    getOptions = ({ options = {}, dispatch, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.geth.options;
        const serverChannel = Channel.server.geth.options;

        return this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(dispatch, onError, onSuccess)
        }, () =>
            ipcRenderer.send(serverChannel, options)
        );
    };
    /**
     * Update sync status sent by main process
     * @param {function} cb callback
     */
    getSyncStatus = ({ options = {}, dispatch, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.geth.syncUpdate;
        const serverChannel = Channel.server.geth.syncUpdate;

        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(dispatch, onError, onSuccess)
        }, () =>
            ipcRenderer.send(serverChannel, options)
        );
    }
}

export { GethService };
