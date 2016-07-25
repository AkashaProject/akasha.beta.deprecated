import { join as pathJoin } from 'path';
import { Logger, transports } from 'winston';
import { W_OK, access as fsAccess, mkdir } from 'fs';
import { app } from 'electron';

const symbolEnforcer = Symbol();
const symbol = Symbol();

class AppLogger {
    public logPath: string;
    public loggers: Object;
    public PATH_OK: boolean;

    /**
     *
     * @param enforcer
     */
    constructor(enforcer: Symbol) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }
        this.loggers = {};
        const defaultPath = pathJoin(app.getPath('userData'), 'logs');
        this._setLogsFolder(defaultPath);
    }

    /**
     *
     * @returns {*}
     */
    static getInstance() {
        if (!this[symbol]) {
            this[symbol] = new AppLogger(symbolEnforcer);
        }
        return this[symbol];
    }

    /**
     *
     * @param path
     * @private
     */
    private _setLogsFolder(path: string) {
        this.logPath = path;
        return fsAccess(this.logPath, W_OK, (err) => {
            if (err) {
                mkdir(this.logPath, (error) => {
                    if (error) {
                        this.PATH_OK = false;
                        throw new Error(error.message);
                    }
                    this.PATH_OK = true;
                });
                return;
            }
            this.PATH_OK = true;
        });
    }

    /**
     *
     * @param name
     * @param level
     * @param errorLevel
     * @param maxsize
     * @param maxFiles
     * @returns {any}
     */
    registerLogger(name: string, {
        level = 'info',
        errorLevel = 'warn',
        maxsize = 10 * 1024,
        maxFiles = 1
    } = {}) {
        if (!this.PATH_OK) {
            throw new Error(`${this.logPath} is not accessible`);
        }
        this.loggers[name] = new (Logger)({
            transports: [
                new (transports.File)({
                    filename: pathJoin(this.logPath, `${name}.error.log`),
                    errorLevel,
                    maxsize,
                    maxFiles,
                    name: `${name}Error`
                }),
                new (transports.File)({
                    filename: pathJoin(this.logPath, `${name}.info.log`),
                    level,
                    maxsize,
                    maxFiles,
                    name: `${name}Info`
                })
            ]
        });
        return this.loggers[name];
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    getLogger(name: string) {
        return this.loggers[name];
    }
}

export default AppLogger;