"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleEmitter_1 = require("./event/ModuleEmitter");
const geth_connector_1 = require("@akashaproject/geth-connector");
const channels_1 = require("../channels");
const responses_1 = require("./event/responses");
const index_1 = require("./modules/auth/index");
const index_2 = require("./contracts/index");
const request_1 = require("request");
const feed_1 = require("./modules/notifications/feed");
const check_version_1 = require("../../check-version");
const faucetToken = '8336abae5a97f017d2d0ef952a6a566d4bbed5cd22c7b524ae749673d5562b567af109371' +
    '81b7bdea73edd25512fdb948b3b016034bb01c0d95f8f9beb68c914';
class AuthIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'auth';
        this.DEFAULT_MANAGED = ['login', 'logout', 'requestEther'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._login()
            ._logout()
            ._generateEthKey()
            ._getLocalIdentities()
            ._requestEther()
            ._manager();
    }
    _login() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].login, (event, data) => {
            index_1.module
                .auth
                .login(data.account, data.password, data.rememberTime, data.registering)
                .then((response) => {
                delete data.password;
                const response1 = responses_1.mainResponse(response, data);
                return this.fireEvent(channels_1.default.client[this.MODULE_NAME].login, response1, event);
            });
        });
        return this;
    }
    _logout() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].logout, (event, data) => {
            feed_1.default.execute({ stop: true });
            index_1.module
                .auth
                .logout();
            const response = responses_1.mainResponse({ done: true }, data);
            return this.fireEvent(channels_1.default.client[this.MODULE_NAME].logout, response, event);
        });
        return this;
    }
    _generateEthKey() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].generateEthKey, (event, data) => {
            index_1.module
                .auth
                .generateKey(data.password)
                .then((address) => {
                delete data.password;
                const response = responses_1.mainResponse({ address }, data);
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].generateEthKey, response, event);
            })
                .catch((error) => {
                delete data.password;
                const response = responses_1.mainResponse({ error }, data);
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].generateEthKey, response, event);
            });
        });
        return this;
    }
    _getLocalIdentities() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getLocalIdentities, (event, data) => {
            let response;
            index_2.constructed
                .instance
                .registry
                .getLocalProfiles()
                .then((list) => {
                response = responses_1.mainResponse(list, data);
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } }, data);
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getLocalIdentities, response, event);
                index_2.constructed
                    .instance
                    .feed
                    .contract
                    .getAppState((err, state) => {
                    const version = geth_connector_1.GethConnector.getInstance().web3.toUtf8(state[0]);
                    check_version_1.default.checkVersion(version, state[1], state[2]);
                });
            });
        });
        return this;
    }
    _requestEther() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].requestEther, (event, data) => {
            request_1.post({
                url: 'https://138.68.78.152:1337/get/faucet',
                json: { address: data.address, token: faucetToken },
                agentOptions: { rejectUnauthorized: false }
            }, (error, response, body) => {
                const data1 = (error) ? { error } : body;
                const response1 = responses_1.mainResponse(data1, data);
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].requestEther, response1, event);
            });
        });
        return this;
    }
}
exports.default = AuthIPC;
//# sourceMappingURL=AuthIPC.js.map