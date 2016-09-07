import GethIPC from './GethIPC';
import IpfsIPC from './IpfsIPC';
import AuthIPC from './AuthIPC';
import Logger from './Logger';
import TxIPC from './TxIPC';
import RegistryIPC from './RegistryIPC';
import WebContents = Electron.WebContents;

export function initModules() {
    const logger = Logger.getInstance();
    const gethChannel = new GethIPC();
    const ipfsChannel = new IpfsIPC();
    const authChannel = new AuthIPC();
    const txChannel = new TxIPC();
    const registryChannel = new RegistryIPC();
    return {
        initListeners: (webContents: WebContents) => {
            logger.registerLogger('akasha', { maxsize: 50 * 1024});
            gethChannel.initListeners(webContents);
            ipfsChannel.initListeners(webContents);
            authChannel.initListeners(webContents);
            txChannel.initListeners(webContents);
            registryChannel.initListeners(webContents);
        },
        logger,
        flushAll: () => {
            gethChannel.purgeAllListeners();
            ipfsChannel.purgeAllListeners();
            authChannel.purgeAllListeners();
            txChannel.purgeAllListeners();
            registryChannel.purgeAllListeners();
        }
    };
}

