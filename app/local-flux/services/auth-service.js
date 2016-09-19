import { ipcRenderer } from 'electron';
import debug from 'debug';
import BaseService from './base-service';
import profileDB from './db/profile';

const Channel = window.Channel;
const dbg = debug('App:AuthService:');
/**
 * Auth Service.
 * default open channels => ['login', 'logout', 'requestEther']
 * available channels =>
 * ['manager', 'login', 'logout', 'requestEther', 'generateEthKey', 'getLocalIdentities']
 */
class AuthService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.auth.manager;
        this.clientManager = Channel.client.auth.manager;
    }
    /**
     * Login profile in AKASHA
     * Request:
     * @param profile.account <String> Eth address of the profile
     * @param profile.password <Uint8Array> The password
     * @param rememberTime <Number> number of minutes to remember
     * Response:
     * @param data = {
     *      token: String -> must be used for the duration of rememberTime
     *      expiration: Date -> expiration time of the token
     * }
     */
    login = (profile, rememberTime) => {
        const serverChannel = Channel.server.auth.login;
        const clientChannel = Channel.client.auth.login;
        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, { ...profile, rememberTime })
            );
        });
    };
    /**
     *  Logout profile
     * @response data: {
     *      done: Boolean
     * }
     */
    logout = () => {
        const serverChannel = Channel.server.auth.logout;
        const clientChannel = Channel.client.auth.logout;
        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    };
    /**
     * Sends a request to faucet
     * Request:
     * @param {string} profileAddress
     * Response:
     * @param data: { tx: String }
     */
    requestEther = ({ address }) => {
        const serverChannel = Channel.server.auth.requestEther;
        const clientChannel = Channel.client.auth.requestEther;

        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, { address })
            );
        });
    };
    /**
     * Create a new eth address
     * @param {Uint8Array} profilePassword - user chosen password
     * @return new Promise
     */
    createEthAddress = ({ password }) => {
        const serverChannel = Channel.server.auth.generateEthKey;
        const clientChannel = Channel.client.auth.generateEthKey;
        if (this._listeners.get(clientChannel)) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, { password })
            );
        });
    };
    /**
     * Get a list of local profiles created
     */
    getLocalIdentities = () => {
        const serverChannel = Channel.server.auth.getLocalIdentities;
        const clientChannel = Channel.client.auth.getLocalIdentities;
        if (this._listeners.has(clientChannel)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    };
    /**
     * Save logged profile to indexedDB database.
     * @param profileData {object}
     */
    createLoggedProfile = profileData =>
        profileDB.transaction('rw', profileDB.loggedProfile, () => {
            dbg('saving logged profile', profileData);
            if (profileData.password) {
                delete profileData.password;
            }
            return profileDB.loggedProfile.add(profileData);
        });
    updateLoggedProfile = loggedProfile =>
        profileDB.transaction('rw', profileDB.loggedProfile, () => {
            dbg('updating loggedProfile', loggedProfile);
            return profileDB.loggedProfile.update(loggedProfile.address, loggedProfile);
        });
    deleteLoggedProfile = loggedProfile =>
        profileDB.transaction('rw', profileDB.loggedProfile, () => {
            dbg('deleting loggedProfile', loggedProfile);
            return profileDB.loggedProfile.delete(loggedProfile.address);
        });
    getLoggedProfile = () =>
        profileDB.transaction('r', profileDB.loggedProfile, () => {
            dbg('getLoggedProfile');
            return profileDB.loggedProfile.toArray();
        });
}

export { AuthService };