import { action } from './helpers';
import { NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

// export const notificationsLoaded = () => action(types.NOTIFICATIONS_LOADED);
export const notificationsSubscribe = notificationsPreferences =>
    action(`${ NOTIFICATIONS_MODULE.subscribe }`, { notificationsPreferences });
