/* eslint strict: 0, no-console: 0 */
'use strict';
const { EVENTS } = require('../settings');
const { ipcMain } = require('electron');

/**
 * IpcService class
 * It provides a base for the other IPC classes.
 *
 */
class IpcService {
    /**
    * Reference to all ipc services
    */
    static services = {};
    /*
     * Constructor for this class.
     * @param {String} type. Ex: geth, ipfs
     * @returns {IpcService}
     */
    constructor (type) {
        this.serverEvent = EVENTS.server[type];
        this.clientEvent = EVENTS.client[type];
        IpcService.services[type] = this;
    }

    /*
     * A helper method for sending events back to the Renderer.
     *
     * @param {EventEmitter} event
     * @returns {Function} the event handler
     */
    _sendEvent (event) {
        return (name, successCode, data, extra) => {
            let result = {
                success: successCode,
                data,
                status: {
                    message: 'ok'
                }
            };
            if (extra) {
                if (typeof extra === 'object') {
                    data = Object.assign(data, extra);
                } else if (typeof extra === 'string') {
                    result.status.message = extra;
                }
            }
            const sender = event ? event.sender : ipcMain;
            sender.send(name, result);
        };
    }

    /**
    * Placeholder for subclasses
    * Here, each IPCService will add cleanup stuff
    */
    shutDown () {

    }

    /**
    *
    */
    static getService (type) {
        return IpcService.services[type];
    }
}

export default IpcService;
