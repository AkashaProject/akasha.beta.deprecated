import { AbstractEmitter } from './AbstractEmitter';
import channels from '../../channels';
import { mainResponse } from './responses';

abstract class ModuleEmitter extends AbstractEmitter {
    protected MODULE_NAME: string;
    protected DEFAULT_MANAGED: string[];

    /**
     *
     * @private
     */
    protected _manager() {
        this.registerListener(
            channels.server[this.MODULE_NAME].manager,
            (event: any, data: IPCmanager) => {
                if (data.listen) {
                    if (this.getListenersCount(data.channel) >= 1) {
                        return this.fireEvent(
                            channels.client[this.MODULE_NAME].manager,
                            mainResponse({ error: { message: `already listening on ${data.channel}` } }),
                            event
                        );
                    }
                    this.listenEvents(data.channel);
                } else {
                    this.purgeListener(data.channel);
                }
                return this.fireEvent(channels.client[this.MODULE_NAME].manager, mainResponse(data), event);
            }
        );
        this.listenEvents(channels.server[this.MODULE_NAME].manager);
        this.DEFAULT_MANAGED.forEach(
            (action: string) =>
                this.listenEvents(channels.server[this.MODULE_NAME][action])
        );
    }

    /**
     * @returns {boolean}
     */
    public attachEmitters() {
        return true;
    }

    protected _initMethods(methods) {
        methods.forEach((method) => {
            this.registerListener(
                channels.server[this.MODULE_NAME][method.name],
                (event: any, data: any) => {
                    let response: any;
                    method
                        .execute(data)
                        .then((result: any) => {
                            response = mainResponse(result);
                        })
                        .catch((err: Error) => {
                            response = mainResponse({ error: { message: err.message }, from: data });
                        })
                        .finally(() => {
                            this.fireEvent(
                                channels.client[this.MODULE_NAME][method.name],
                                response,
                                event
                            );
                        });
                }
            )
        });
    }
}
export default ModuleEmitter;
