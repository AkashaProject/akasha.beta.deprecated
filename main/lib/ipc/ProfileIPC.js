"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const index_1 = require('./modules/auth/index');
const index_2 = require('./modules/profile/index');
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const index_3 = require('./contracts/index');
const channels_1 = require('../channels');
const responses_1 = require('./event/responses');
class ProfileIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'profile';
        this.DEFAULT_MANAGED = ['getProfileData', 'getMyBalance', 'getIpfs'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._getMyBalance()
            ._getProfileData()
            ._getIpfs()
            ._unregister()
            ._follow()
            ._getFollowers()
            ._getFollowersCount()
            ._getFollowing()
            ._getFollowingCount()
            ._manager();
    }
    _getProfileData() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getProfileData, (event, data) => {
            let response;
            index_3.constructed
                .instance
                .profile
                .getIpfs(data.profile)
                .then((resp) => {
                if (data.full) {
                    return index_2.module.helpers.resolveProfile(resp);
                }
                return index_2.module.helpers.getShortProfile(resp);
            })
                .then((resp) => {
                response = responses_1.mainResponse(resp);
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getProfileData, response, event);
            });
        });
        return this;
    }
    _getMyBalance() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getMyBalance, (event, data) => {
            let response;
            const etherBase = (data.etherBase) ? data.etherBase : geth_connector_1.GethConnector.getInstance().web3.eth.defaultAccount;
            return geth_connector_1.GethConnector.getInstance()
                .web3
                .eth
                .getBalanceAsync(etherBase)
                .then((weiAmount) => {
                const unit = (data.unit) ? data.unit : 'ether';
                const value = geth_connector_1.GethConnector.getInstance()
                    .web3
                    .fromWei(weiAmount, unit);
                if (!etherBase) {
                    throw new Error('No ethereum address specified');
                }
                response = responses_1.mainResponse(value);
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getMyBalance, response, event);
            });
        });
        return this;
    }
    _getIpfs() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getIpfs, (event, data) => {
            let response;
            const chain = (data.full) ? index_2.module.helpers.resolveProfile(data.ipfsHash) :
                index_2.module.helpers.getShortProfile(data.ipfsHash);
            chain.then((resolved) => {
                response = responses_1.mainResponse(resolved);
            }).catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getIpfs, response, event);
            });
        });
        return this;
    }
    _unregister() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].unregister, (event, data) => {
            let response;
            index_3.constructed
                .instance
                .profile
                .unregister(data.profileAddress)
                .then((txData) => {
                return index_1.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].unregister, response, event);
            });
        });
        return this;
    }
    _follow() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].follow, (event, data) => {
            let response;
            index_3.constructed.instance
                .main
                .follow(data.profileAddress)
                .then((txData) => {
                return index_1.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].follow, response, event);
            });
        });
        return this;
    }
    _getFollowersCount() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getFollowersCount, (event, data) => {
            let response;
            index_3.constructed.instance.main.getFollowersCount(data.profileAddress)
                .then((count) => {
                response = responses_1.mainResponse({ count });
            }).catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getFollowersCount, response, event);
            });
        });
        return this;
    }
    _getFollowingCount() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getFollowingCount, (event, data) => {
            let response;
            index_3.constructed.instance.main.getFollowingCount(data.profileAddress)
                .then((count) => {
                response = responses_1.mainResponse({ count });
            }).catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getFollowingCount, response, event);
            });
        });
        return this;
    }
    _getFollowers() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getFollowers, (event, data) => {
            let response;
            index_3.constructed.instance.main.getFollowersCount(data.profileAddress)
                .then((count) => {
                response = responses_1.mainResponse({ count });
            }).catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getFollowers, response, event);
            });
        });
        return this;
    }
    _getFollowing() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getFollowers, (event, data) => {
            let response;
            index_3.constructed.instance.main.getFollowingCount(data.profileAddress)
                .then((count) => {
                response = responses_1.mainResponse({ count });
            }).catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getFollowing, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfileIPC;
//# sourceMappingURL=ProfileIPC.js.map