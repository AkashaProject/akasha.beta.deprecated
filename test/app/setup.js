// import 'babel-polyfill';
// import { jsdom } from 'jsdom';
// import hook from 'css-modules-require-hook';
import sinon from 'sinon';
import Channel from './helpers/channels';
import { createActionChannels } from '../../app/local-flux/sagas/helpers';

before('init tests', function () {
    this.sandbox = sinon.sandbox.create();
    createActionChannels(Channel);
});

// hook({
//     generateScopedName: '[name]__[local]___[hash:base64:5]'
// });

// global.document = jsdom('<!doctype html><html><body></body></html>');
// global.window = global.document.defaultView;
// global.navigator = global.window.navigator;
