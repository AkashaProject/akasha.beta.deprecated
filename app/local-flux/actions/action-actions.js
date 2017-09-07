import * as types from '../constants';
import { action } from './helpers';

export const actionAdd = (akashaId, actionType, payload) =>
    action(types.ACTION_ADD, { akashaId, actionType, payload });
export const actionDelete = id => action(types.ACTION_DELETE, { id });
export const actionGetPending = () => action(types.ACTION_GET_PENDING);

export const actionGetPendingError = (error) => {
    error.code = 'AGPE01';
    error.messageId = 'actionGetPending';
    return action(types.ACTION_GET_PENDING_ERROR, { error });
};

export const actionGetPendingSuccess = data => action(types.ACTION_GET_PENDING_SUCCESS, { data });
export const actionPublish = id => action(types.ACTION_PUBLISH, { id });

export const actionSaveError = (error) => {
    error.code = 'ASE01';
    error.messageId = 'actionSave';
    return action(types.ACTION_SAVE_ERROR, { error });
};

export const actionUpdate = changes => action(types.ACTION_UPDATE, { changes });