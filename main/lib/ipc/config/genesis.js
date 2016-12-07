"use strict";
const electron_1 = require('electron');
const fs_1 = require('fs');
const path_1 = require('path');
const writeGenesisFile = () => {
    const genesis = {
        "alloc": {},
        "config": {
            "homesteadBlock": 10
        },
        "coinbase": "0x0000000000000000000000000000000000000000",
        "difficulty": "0x20000",
        "extraData": "",
        "gasLimit": "0x493e00",
        "nonce": "0x0000000193221442",
        "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "timestamp": "0x00"
    };
    const genesisBuffer = Buffer.from(JSON.stringify(genesis));
    fs_1.writeFileSync(getGenesisPath(), genesisBuffer);
};
function getGenesisPath() {
    return path_1.join(electron_1.app.getPath('userData'), 'genesis.json');
}
exports.getGenesisPath = getGenesisPath;
function checkForGenesis(cb) {
    fs_1.open(getGenesisPath(), 'r', (err, fd) => {
        if (err) {
            if (err.code === "ENOENT") {
                writeGenesisFile();
                return cb();
            }
            return cb(err);
        }
        return cb();
    });
}
exports.checkForGenesis = checkForGenesis;
//# sourceMappingURL=genesis.js.map