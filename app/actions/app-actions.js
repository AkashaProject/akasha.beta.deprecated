import { appActionCreators } from './action-creators'
let appActions = null;

class AppActions {
    constructor (dispatch) {
        if (!appActions) {
            appActions = this;
        }
        this.dispatch = dispatch;
        return appActions;
    }

    showError = (error) => {
        this.dispatch(appActionCreators.showError(error));
    };

    clearErrors = () => {
        this.dispatch(appActionCreators.clearError);
    };
    /**
     * Changes currently visible panel
     * @param {Object} panel
     * @param {String} panel.name
     * @param {Boolean} panel.overlay Shows clickable overlay below panel. Useful to close the panel
     */
    changePanel = (panel) => this.showPanel(panel);
    showPanel = (panel) => this.dispatch(appActionCreators.showPanel(panel));
    hidePanel = (panel) => this.dispatch(appActionCreators.hidePanel(panel));
}

export { AppActions };
