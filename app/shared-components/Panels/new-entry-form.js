import React, { Component, PropTypes } from 'react';
import {
    Paper,
    RaisedButton,
    Tabs,
    Tab,
    SelectField,
    MenuItem,
    Card,
    CardHeader,
    CardText,
    IconMenu,
    IconButton,
    CircularProgress } from 'material-ui';
import SearchBar from '../SearchBar/search-bar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class NewEntryFormPanel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tabsValue: 'drafts',
            searchValue: '',
            sortByValue: 'latest'
        };
    }
    _handleTabsChange = (value) => {
        this.setState({
            tabsValue: value,
            isTabLoading: true
        });
    }
    _handleSearchChange = (ev) => {
        this.setState({
            searchValue: ev.target.value
        });
    }
    _handleSortByValueChange = (ev, value, payload) => {
        this.setState({
            sortByValue: payload
        });
    }
    _handleEntryEdit = (ev, entryId) => {
        const entryType = this.state.tabsValue;
        const { router } = this.context;
        const { profileState, appActions } = this.props;
        const userName = profileState.get('loggedProfile').get('userName');
        appActions.hidePanel();
        switch (entryType) {
            case 'drafts':
                return router.push(`/${userName}/draft/${entryId}`);
            default:
                break;
        }
    }
    _handleNewEntry = (ev) => {
        const { router } = this.context;
        const { profileState, appActions } = this.props;
        const userName = profileState.get('loggedProfile').get('userName');
        appActions.hidePanel();
        return router.push(`/${userName}/draft/new`);
    }
    _getTabContent = () => {
        const { entryState } = this.props;
        let entries;
        switch (this.state.tabsValue) {
            case 'drafts':
                entries = entryState.get('drafts');
                break;
            case 'listed':
                entries = entryState.get('published');
                break;
            case 'unlisted':
                entries = entryState.get('published');
                break;
            default:
                break;
        }
        const entryCards = entries.map((card, key) => {
            return (
              <Card key={key} style={{ marginBottom: 8 }}>
                <CardHeader
                  title="Draft"
                  subtitle="1 day ago - 18 words so far"
                >
                  <div style={{ width: '55%', display: 'inline-block', textAlign: 'right' }}>
                    <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                      <MenuItem
                        primaryText="Edit"
                        onClick={(ev) => this._handleEntryEdit(ev, card.id)}
                      />
                      <MenuItem primaryText="Publish" />
                      <MenuItem primaryText="Delete" />
                    </IconMenu>
                  </div>
                </CardHeader>
                <CardText>
                  <h2
                    onClick={(ev) => this._handleEntryEdit(ev, card.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {card.title && card.title}
                    {!card.title && 'No Title'}
                  </h2>
                </CardText>
                <CardText>
                  <p>{card.excerpt}</p>
                </CardText>
              </Card>
            );
        });
        return (
          <div>{entryCards}</div>
        );
    }
    render () {
        const tabStyle = {
            backgroundColor: '#FFF',
            color: '#444'
        };
        return (
          <Paper style={this.props.rootStyle}>
            <div
              className="row"
              style={{
                  borderBottom: '1px solid #DDD',
                  padding: '12px 24px 0',
                  margin: 0
              }}
            >
              <div className="col-xs-8">
                <Tabs
                  value={this.state.tabsValue}
                  onChange={this._handleTabsChange}
                  inkBarStyle={{ backgroundColor: '#4285F4' }}
                >
                  <Tab label="Drafts" value="drafts" style={tabStyle} />
                  <Tab label="Listed" value="listed" style={tabStyle} />
                  <Tab label="Unlisted" value="unlisted" style={tabStyle} />
                </Tabs>
              </div>
              <div className="col-xs-4 end-xs">
                <RaisedButton label="new entry" primary onTouchTap={this._handleNewEntry} />
              </div>
            </div>
            <div
              className="row"
              style={{
                  margin: 0,
                  padding: '0 18px',
                  position: 'absolute',
                  top: 61,
                  bottom: 0,
                  overflowY: 'auto'
              }}
            >
              <div className="col-xs-12" style={{ padding: 0 }}>
                <div className="row middle-xs" style={{ margin: 0 }}>
                  <div className="col-xs-8">
                    <SearchBar
                      hintText={
                        `Search
                         ${this.state.tabsValue}
                         ${this.state.tabsValue === 'drafts' ? '' : 'entries'}`
                      }
                      onChange={this._handleSearchChange}
                      showCancelButton={(this.state.searchValue.length > 0)}
                      value={this.state.searchValue}
                      searchIconStyle={{
                          marginRight: '-24px',
                          marginBottom: '-19px',
                          height: '48px'
                      }}
                    />
                  </div>
                  <div className="col-xs-4">
                    <div className="row middle-xs">
                      <div className="col-xs-5">Sort By</div>
                      <SelectField
                        className="col-xs-7"
                        value={this.state.sortByValue}
                        onChange={this._handleSortByValueChange}
                        style={{ width: '50px' }}
                      >
                        <MenuItem value="latest" primaryText="Latest" />
                        <MenuItem value="oldest" primaryText="Oldest" />
                      </SelectField>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                {/** this.state.isTabLoading &&
                  <div className="center-xs" style={{ paddingTop: '12.5%' }}>
                    <CircularProgress />
                  </div>
                **/}
                <div>
                  {this._getTabContent()}
                </div>
              </div>
            </div>
          </Paper>
        );
    }
}
NewEntryFormPanel.propTypes = {
    maxWidth: PropTypes.string,
    rootStyle: PropTypes.object,
    profileState: PropTypes.object,
    entryState: PropTypes.object,
    entryActions: PropTypes.object,
    appActions: PropTypes.object
};
NewEntryFormPanel.contextTypes = {
    router: PropTypes.object
};
NewEntryFormPanel.defaultProps = {
    rootStyle: {
        height: '100%',
        width: 640,
        zIndex: 10,
        position: 'relative'
    }
};
export default NewEntryFormPanel;