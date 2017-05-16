// import { SpellCheckHandler, ContextMenuListener, ContextMenuBuilder } from 'electron-spellchecker';
import Channel from './lib/channels';
import { ApiListener, ApiRequest } from './ipcPreloader';
// Linux: libxtst-dev, libx11-dev, libxkbfile-dev
function injectApi() {

    const AkashaApi = Object.assign({}, Channel);

    Object.keys(Channel.client).forEach((module) => {
        Object.keys(Channel.client[module]).forEach((method) => {
            AkashaApi.client[module][method] = new ApiListener(Channel.client[module][method], method);
        });
    });

    Object.keys(Channel.server).forEach((module) => {
        Object.keys(Channel.server[module]).forEach((method) => {
            if (method !== 'manager') {
                AkashaApi.server[module][method] = new ApiRequest(
                    Channel.server[module][method],
                    Channel.server[module]['manager'],
                    method
                );
            }
        });
    });
    return AkashaApi;
}

window['Channel'] = injectApi();

window['eval'] = function () {
    throw new Error('eval disabled.');
};

/*
 //spellchecking stuff
 window['spellCheckHandler'] = new SpellCheckHandler();

 if (process.env.NODE_ENV !== 'development') {
 setTimeout(() => window['spellCheckHandler'].attachToInput(), 1000);
 window['spellCheckHandler'].switchLanguage(navigator.language);
 window['contextMenuBuilder'] = new ContextMenuBuilder(window['spellCheckHandler']);

 window['contextMenuListener'] = new ContextMenuListener((info) => {
 window['contextMenuBuilder'].showPopupMenu(info);
 });
 }
 */