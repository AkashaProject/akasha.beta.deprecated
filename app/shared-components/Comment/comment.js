import React from 'react';
import {
    CardHeader,
    Divider,
    IconButton,
    FlatButton,
    SvgIcon,
    CircularProgress
  } from 'material-ui';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import { injectIntl } from 'react-intl';
import HubIcon from 'material-ui/svg-icons/hardware/device-hub';
import MoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import LessIcon from 'material-ui/svg-icons/navigation/expand-less';
import { Avatar } from 'shared-components';
import { entryMessages } from 'locale-data/messages';
import { getWordCount } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import style from './comment.scss';

class Comment extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isExpanded: null,
            editorState: null
        };
    }
    componentWillMount () {
        const { comment } = this.props;
        let isExpanded = null;
        if (!comment.data.content) {
            return;
        }
        const editorState = editorStateFromRaw(JSON.parse(comment.data.content));
        const wordCount = getWordCount(editorState.getCurrentContent());
        if (wordCount > 60) {
            isExpanded = false;
        }
        this.setState({
            isExpanded
        });
    }
    _toggleExpanded = (ev, isExpanded) => {
        ev.preventDefault();
        this.setState({
            isExpanded
        });
    }
    render () {
        const { isPublishing, comment,
            children, intl, onAuthorNameClick, entryAuthorProfile, loggedProfile } = this.props;
        const { isExpanded } = this.state;
        const { data } = comment;
        const { profile, date, content } = data;
        const { palette } = this.context.muiTheme;
        const authorName = `${profile.get('firstName')} ${profile.get('lastName')}`;
        const authorAvatar = (profile.get('avatar') === `${profile.get('baseUrl')}/`) ?
            null : profile.get('avatar');
        const authorProfilePath = `profile/${profile.get('profile')}`;
        const isEntryAuthor = entryAuthorProfile === profile.get('profile');
        const viewerIsAuthor = loggedProfile.get('profile') === profile.get('profile');
        let commentAuthorNameColor = palette.commentAuthorColor;
        let expandedStyle = {};
        if (isExpanded === false) {
            expandedStyle = {
                maxHeight: 155,
                overflow: 'hidden'
            };
        }
        if (isExpanded === true) {
            expandedStyle = {
                maxHeight: 'none',
                overflow: 'visible'
            };
        }
        if (viewerIsAuthor) {
            commentAuthorNameColor = palette.commentViewerIsAuthorColor;
        }
        if (isEntryAuthor) {
            commentAuthorNameColor = palette.commentIsEntryAuthorColor;
        }
        return (
          <div
            className={`${style.root}`}
            style={{ position: 'relative', opacity: !content ? 0.5 : 1 }}
          >
            <div
              className={`row ${style.commentHeader}`}
              style={{ marginBottom: !content ? '8px' : '0px' }}
            >
              <div className={`col-xs-5 ${style.commentAuthor}`}>
                <CardHeader
                  style={{ padding: 0 }}
                  titleStyle={{ fontSize: '100%' }}
                  subtitleStyle={{ fontSize: '80%' }}
                  title={
                    <FlatButton
                      label={authorName}
                      hoverColor="transparent"
                      style={{ height: 28, lineHeight: '28px' }}
                      labelStyle={{
                          textTransform: 'capitalize',
                          paddingLeft: 4,
                          paddingRight: 4,
                          color: commentAuthorNameColor
                      }}
                      onClick={() => { onAuthorNameClick(authorProfilePath); }}
                      className={`${viewerIsAuthor && style.viewer_is_author}
                        ${isEntryAuthor && style.is_entry_author} ${style.author_name}`}
                    />
                  }
                  subtitle={date && intl.formatRelative(new Date(date))}
                  avatar={
                    <Avatar
                      image={authorAvatar}
                      style={{ display: 'inline-block', cursor: 'pointer' }}
                      userInitials={authorName.match(/\b\w/g).reduce((prev, current) => prev + current, '')}
                      radius={40}
                      onClick={() => { onAuthorNameClick(authorProfilePath); }}
                      userInitialsStyle={{ fontSize: 20, textTransform: 'uppercase', fontWeight: 500 }}
                    />
                  }
                />
              </div>
              {isPublishing &&
                <div className={'col-xs-7 end-xs'}>
                  <CircularProgress size={32} />
                </div>
              }
            </div>
            {content &&
              <div className={`row ${style.commentBody}`} style={expandedStyle}>
                <MegadraftEditor
                  readOnly
                  editorState={editorStateFromRaw(JSON.parse(content))}
                  sidebarRendererFn={() => null}
                />
              </div>
            }
            {!content &&
              <IconButton
                style={{ position: 'absolute', right: '10px', top: '7px' }}
                tooltip={intl.formatMessage(entryMessages.unresolvedEntry)}
              >
                <HubIcon color={palette.accent1Color} />
              </IconButton>
            }
            {isExpanded !== null &&
              <div style={{ paddingTop: 16, fontSize: 12, textAlign: 'center' }}>
                {(this.state.isExpanded === false) &&
                  <IconButton onClick={ev => this._toggleExpanded(ev, true)}>
                    <SvgIcon>
                      <MoreIcon />
                    </SvgIcon>
                  </IconButton>
                }
                {this.state.isExpanded &&
                  <IconButton onClick={ev => this._toggleExpanded(ev, false)}>
                    <SvgIcon>
                      <LessIcon />
                    </SvgIcon>
                  </IconButton>
                }
              </div>
            }
            <Divider />
            {children &&
              <div className={`${style.commentReply}`}>
                {children}
              </div>
            }
          </div>
        );
    }
}
Comment.propTypes = {
    children: React.PropTypes.node,
    isPublishing: React.PropTypes.bool,
    entryAuthorProfile: React.PropTypes.string,
    loggedProfile: React.PropTypes.shape(),
    comment: React.PropTypes.shape(),
    intl: React.PropTypes.shape(),
    onAuthorNameClick: React.PropTypes.func
};
Comment.contextTypes = {
    router: React.PropTypes.shape(),
    muiTheme: React.PropTypes.shape()
};

export default injectIntl(Comment);
