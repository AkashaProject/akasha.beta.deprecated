const { ipcMain } = require('electron');
const MainService = require('./main');
const Dapple = require('../../../contracts.sol/build/js_module.js');
const request = require('request');
const Promise = require('bluebird');

/**
 * UserService class
 * It provides the Renderer with access to User instance.
 * It also registers events for the Renderer.
 *
 */
class UserService extends MainService {
    /*
     * @returns {UserService}
     */
    constructor () {
        super('user');
        this.IPFS_ADD_SIGNUP_FAIL = 'ipfs add user signup fail';
        this.NO_COINBASE_FAIL = 'no coinbase / no ethereum account';
        this.textFields = ['username', 'firstName', 'lastName', 'description'];
        this.CREATE_PROFILE_CONTRACT_GAS = 800000;
        this.FAUCET_URL = 'http://faucet.ma.cx:3000/donate/';
    }
    /*
     * It sets up the listeners for this module.
     * Events used are:
     * server:ipfs:startService used by the View layer to start the ipfs executable
     *
     * @param {BrowserWindow} mainWindow -- ignored for now
     * @returns undefined
     */
    setupListeners () {
        ipcMain.on(this.serverEvent.exists, (event, arg) => {
            this._usernameExists(event, arg);
        });
        ipcMain.on(this.serverEvent.createCoinbase, (event, arg) => {
            this._createCoinbase(event, arg);
        });
        ipcMain.on(this.serverEvent.faucetEther, (event, arg) => {
            this._faucetEther(event, arg);
        });
        ipcMain.on(this.serverEvent.registerProfile, (event, arg) => {
            this._registerProfile(event, arg);
        });
        ipcMain.on(this.serverEvent.listAccounts, (event, arg) => {
            this._listAccounts(event, arg);
        });
        ipcMain.on(this.serverEvent.getBalance, (event, arg) => {
            this._getBalance(event, arg);
        });
        ipcMain.on(this.serverEvent.listEtherAccounts, (event, arg) => {
            this._listEtherAccounts(event, arg);
        });
        ipcMain.on(this.serverEvent.login, (event, arg) => {
            this._login(event, arg);
        });
    }

    _usernameExists (event, arg) {
        const web3 = this.__getWeb3();
        const registry = new Dapple.class(web3).objects.registry;
        registry.getById.call(web3.fromUtf8(arg.username), {

        }, (err, res) => {
            if (!err) {
                this._sendEvent(event)(this.clientEvent.exists, true, res);
            }
        });
    }

    _createCoinbase (event, arg) {
        const web3 = this.__getWeb3();
        web3.personal.newAccountAsync(arg.password).then((data) => {
            this._sendEvent(event)(this.clientEvent.createCoinbase, true, data);
        });
    }
    /**
    * @param {Object} event, {Object} arg
    * ex: arg = {account: '0x23948239489249823498'}
    */
    _getBalance (event, arg) {
        const web3 = this.__getWeb3();
        web3.eth.getBalanceAsync(this._getCoinbase(arg, web3)).then((data) => {
            const etherBalance = parseFloat(web3.fromWei(data.toString(), 'ether'));
            this._sendEvent(event)(this.clientEvent.getBalance, true, etherBalance);
        });
    }

    _login (event, arg) {
        const web3 = this.__getWeb3();
        web3
            .personal
            .unlockAccountAsync(arg.account,
                                arg.password,
                                arg.interval ? arg.interval : this.UNLOCK_INTERVAL)
            .then((result) => {
                if (result) { // if successful then it is true
                    web3.eth.defaultAccount = arg.account;
                    this._sendEvent(event)(this.clientEvent.login,
                                        true,
                                        this.UNLOCK_COINBASE_SUCCESS);
                }
            })
            .catch((err) => {
                this._sendEvent(event)(this.clientEvent.login,
                                    false,
                                    this.UNLOCK_COINBASE_FAIL);
            });
    }

    _listEtherAccounts (event, arg) {
        const web3 = this.__getWeb3();
        web3.personal.getListAccountsAsync().then((data) => {
            this._sendEvent(event)(this.clientEvent.getBalance, true, {
                accounts: data
            });
        });
    }

    _listAccounts (event, arg) {
        const web3 = this.__getWeb3();
        const profilePromises = [];
        web3.personal.getListAccountsAsync().then((data) => {
            const akashaContracts = new Dapple.class(web3);
            const registry = akashaContracts.objects.registry;
            const profile = akashaContracts.classes.AkashaProfile;
            const getByAddrPromise = Promise.promisify(registry.getByAddr.call);
            for (let i = 0; i < data.length; i++) {
                const ethAccount = data[i];
                profilePromises.push(
                    getByAddrPromise(ethAccount)
                    .then(
                        (
                            (eth) => (profileContractAddress) => {
                                return {
                                    eth,
                                    profileContractAddress
                                };
                            }
                        )(ethAccount)
                    )
                );
            }

            Promise.all(profilePromises).then((results) => {
                let noProfile = true;
                for (let i = 0; i < results.length; i++) {
                    const akashaProfileContractHash = results[i].profileContractAddress;
                    const ethAccount = results[i].eth;
                    if (akashaProfileContractHash !== this.ZERO_ADDR) {
                        noProfile = false;
                        profile
                            .at(akashaProfileContractHash)
                            .getIpfs
                            .call(((ethAddress) => {
                                return (err, tuple) => {
                                    const ipfsHash = web3.toUtf8(tuple[0]) + web3.toUtf8(tuple[1]);
                                    this.
                                        _getIpfsAPI()
                                        .cat({
                                            id: ipfsHash,
                                            encoding: 'utf8'
                                        })
                                        .then((result) => {
                                            this._sendEvent(event)(
                                                this.clientEvent.listAccounts,
                                                true,
                                                { ethAddress, result }
                                            );
                                        })
                                        .catch((ipfsErr) => {
                                            this._sendEvent(event)(
                                                this.clientEvent.listAccounts,
                                                false,
                                                ipfsErr);
                                        });
                                };
                            })(ethAccount));
                    }
                }
                if (noProfile) {
                    this._sendEvent(event)(
                        this.clientEvent.listAccounts,
                        true,
                        []);
                }
            });
        });
    }

    _faucetEther (event, arg) {
        const web3 = this.__getWeb3();
        const URL = this.FAUCET_URL +
                    this._getCoinbase(arg, web3); // eslint-disable-line prefer-template
        request({
            uri: URL,
            method: 'GET',
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 4
        }, (error, response, body) => {
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            if (body && body.txhash) {
                this.
                    _sendEvent(event)(this.clientEvent.faucetRequestEther, true, body.txhash);
            }
            this
                .__getGeth()
                .addFilter('tx', body.txhash, (txInfo) => {
                    this.
                        _sendEvent(event)(this.clientEvent.faucetEther, true, txInfo);
                });
        });
    }

    _uploadImages (signupJSON) {
        const imagePromises = [];
        if (signupJSON.optionalData.avatarFile) {
            imagePromises.push(this._uploadImage('avatar', signupJSON.optionalData.avatarFile));
        }
        if (signupJSON.bg1) {
            imagePromises.push(this._uploadImage('bg1', signupJSON.bg1));
        }
        if (signupJSON.bg2) {
            imagePromises.push(this._uploadImage('bg2', signupJSON.bg2));
        }
        if (signupJSON.bg3) {
            imagePromises.push(this._uploadImage('bg3', signupJSON.bg3));
        }
        if (signupJSON.bg4) {
            imagePromises.push(this._uploadImage('bg4', signupJSON.bg4));
        }
        return Promise.all(imagePromises).then((data) => {
            const imageHashes = {};
            for (const result of data) {
                imageHashes[result.name] = result.hash;
            }
            console.log(imageHashes);
            return imageHashes;
        }).catch((err) => err);
    }

    _registerProfile (event, arg) {
        this
        ._uploadImages(arg)
        .then((imageHashes) => {
            const fullProfileJSON = Object.assign({}, imageHashes);
            for (const key of this.textFields) {
                fullProfileJSON[key] = arg[key];
            }
            return this._addToIpfs({
                data: JSON.stringify(fullProfileJSON)
            })
            .then((response) => {
                const ipfsHash = response[0].Hash;
                const web3 = this.__getWeb3();
                return web3
                    .personal
                    .unlockAccountAsync(arg.account, arg.password, 10000)
                    .then((unlocked) => {
                        const registry = new Dapple.class(web3).objects.registry;
                        return registry.register(
                            web3.fromUtf8(arg.username),
                            this._chopIpfsHash(ipfsHash),
                            {
                                from: arg.account,
                                gas: this.CREATE_PROFILE_CONTRACT_GAS
                            }, (error, tx) => {
                                if (!error) {
                                    this._sendEvent(event)(
                                        this.clientEvent.registerProfileHash,
                                    true,
                                    tx); // o sa ii pasez si currentblock
                                    this
                                        .__getGeth()
                                        .addFilter('tx', tx, (txInfo) => {
                                            this.
                                                _sendEvent(event)(this.clientEvent.registerProfileComplete,
                                                                    true,
                                                                    txInfo);
                                        });
                                } else {
                                    return this._sendEvent(event)(
                                        this.clientEvent.registerProfileHash,
                                    false,
                                    error.message); // o sa ii pasez si currentblock
                                }
                            });
                    }).catch((err) => {
                        console.error(err);
                        this._sendEvent(event)(this.clientEvent.registerProfileHash,
                                            false,
                                            this.UNLOCK_COINBASE_FAIL);
                    });
            })
            .catch((err) => {
                this._sendEvent(event)(this.clientEvent.registerProfileHash,
                                        false,
                                        this.IPFS_ADD_SIGNUP_FAIL);
            });
        })
            .catch((err) => {
                this._sendEvent(event)(this.clientEvent.registerProfileHash,
                                        false,
                                        this.IPFS_ADD_SIGNUP_FAIL);
            });
    }
}

export default UserService;
