import React, { Component, PropTypes } from 'react';
import { Paper, RaisedButton } from 'material-ui';
import imageCreator, { findBestMatch } from 'utils/imageUtils';
import { Avatar, PanelContainer } from 'shared-components';
import { FormattedMessage } from 'react-intl';

// Remember to update height and width values inside getBackgroundImageStyle method
const imageWrapperStyle = {
    height: '200px',
    width: '400px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const wrapTextStyle = {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis'
};

class ProfileDetails extends Component {

    getBackgroundImageStyle = (backgroundImage) => {
        if (!backgroundImage) {
            return {};
        }
        const originalRatio = backgroundImage.width / backgroundImage.height;
        const actualRatio = 400 / 200;
        if (originalRatio > actualRatio) {
            return {
                height: '200px'
            };
        }
        return {
            width: '400px'
        };
    }

    renderHeader () {
        const { followProfile, followPending } = this.props;
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};
        const { backgroundImage, avatar } = profileData;
        const bestMatch = findBestMatch(400, backgroundImage);
        const imageUrl = backgroundImage[bestMatch] ?
            imageCreator(backgroundImage[bestMatch].src['/'], profileData.baseUrl) :
            '';
        const userInitials =
            `${profileData.firstName[0]}${profileData.lastName[0]}`;
        const followers = <FormattedMessage
          id="app.profile.followersCount"
          description="counting a profile's followers"
          defaultMessage={`{followersCount, number} {followersCount, plural,
            one {follower}
            few {followers}
            many {followers}
            other {followers}
          }`}
          values={{ followersCount: 1 }}
        />;

        return <div>
          <div style={imageWrapperStyle}>
            <img
              src={imageUrl}
              style={this.getBackgroundImageStyle(backgroundImage[bestMatch])}
              role="presentation"
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Avatar
              image={avatar}
              radius={100}
              userInitials={userInitials}
              userInitialsStyle={{
                  textTransform: 'uppercase',
                  fontSize: '36px',
                  fontWeight: '600',
                  margin: '0px'
              }}
              style={{ position: 'absolute', left: '30px', bottom: '-50px' }}
            />
          </div>
          <div style={{ padding: '50px 30px 10px' }}>
            <div
              title={`${profileData.firstName} ${profileData.lastName}`}
              style={{
                  fontSize: '32px',
                  fontWeight: 400,
                  textTransform: 'capitalize',
                  maxWidth: '340px',
                  ...wrapTextStyle
              }}
            >
              {`${profileData.firstName} ${profileData.lastName}`}
            </div>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: '16px', fontWeight: 300 }}>
                <span style={{ display: 'inline-block', maxWidth: '340px', ...wrapTextStyle }}>
                  {`@${profileData.username}`}
                  <span style={{ margin: '0 5px' }}>-</span>
                </span>
                {followers}
              </div>
            </div>
            <RaisedButton
              label="Follow"
              primary
              style={{ margin: '20px 0' }}
              buttonStyle={{ width: '120px' }}
              labelStyle={{ fontWeight: 300 }}
              onClick={followProfile}
              disabled={followPending}
            />
          </div>
        </div>;
    }

    render () {
        const profileData = this.props.profileData ? this.props.profileData.toJS() : {};

        return <PanelContainer
          style={{ flex: '0 0 400px', height: '100%' }}
          header={this.renderHeader()}
          headerStyle={{ padding: '0px' }}
          contentStyle={{ padding: '0 30px 30px', top: '408px', bottom: '0px' }}
          showBorder={false}
          headerHeight={408}
          headerMinHeight={408}
        >
          <div
            style={{
                maxWidth: '340px', overflowY: 'auto', overflowX: 'hidden'
            }}
          >
            {profileData.about &&
              <div style={{ paddingBottom: '15px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>About</div>
                <div style={{ fontSize: '16px', fontWeight: 300 }}>
                  {profileData.about}
                </div>
              </div>
            }
            {profileData.links && profileData.links.length &&
              <div style={{ paddingBottom: '15px' }}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>Links</div>
                {profileData.links.map((link, key) =>
                  <div key={key} style={{ display: 'flex', fontSize: '16px', fontWeight: 300 }}>
                    <span
                      title={`${link.title}:`}
                      style={{ display: 'inline-block', maxWidth: '50%', ...wrapTextStyle }}
                    >
                      {`${link.title}:`}
                    </span>
                    <span
                      title={link.url}
                      style={{
                          marginLeft: '10px',
                          display: 'inline-block',
                          maxWidth: '50%',
                          ...wrapTextStyle
                      }}
                    >
                      {link.url}
                    </span>
                  </div>
                )}
              </div>
            }
          </div>
        </PanelContainer>;
    }
}

ProfileDetails.contextTypes = {
    muiTheme: PropTypes.shape()
};

ProfileDetails.propTypes = {
    profileData: PropTypes.shape(),
    followProfile: PropTypes.func,
    followPending: PropTypes.bool
};

export default ProfileDetails;