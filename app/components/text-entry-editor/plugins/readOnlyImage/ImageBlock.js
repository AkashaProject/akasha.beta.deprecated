import PropTypes from 'prop-types';
import React, { Component } from 'react';
import withWidth from 'material-ui/utils/withWidth';
import { findClosestMatch } from 'utils/imageUtils'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './image-block.scss';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';

class ImageBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            isPlaying: false,
            imageLoaded: false
        };
    }
    _getBaseNodeStyle = () => {
        const { media } = this.props.data;
        if (media === 'xs') {
            const marginLeft = ((document.body.getBoundingClientRect().width - 700) / 2) - 32;
            return {
                width: 320,
                float: 'left',
                marginRight: 48,
                // @TODO: DIRTYHACK!! GET RID OF THIS!!!
                marginLeft
            };
        }
        if (media === 'md') {
            if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
            return {
                margin: '48px auto',
                width: 700
            };
        }
        if (media === 'lg' || media === 'xl' || media === 'xxl') {
            if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
            return {
                margin: '48px auto',
                width: '100%'
            };
        }
        return {};
    }
    _handleImageClick = (ev) => {
        const { files } = this.props.data;
        if (files.gif) {
            this.setState({
                isPlaying: !this.state.isPlaying
            });
        }
    }

    _getImageSrc = () => {
        const { files, media } = this.props.data;
        const { width } = this.props;
        const widths = [320, 700, 1280, 1920];
        let fileKey = findClosestMatch(widths[width], files, media);
        if ((media === 'xl' || media === 'xxl') && this.baseNodeRef) {
            fileKey = findClosestMatch(this.baseNodeRef.parentNode.clientWidth, files, media);
        }
        // @todo: [code: 3ntry3] get rid of this too;
        if (files.gif && this.state.isPlaying) {
            fileKey = 'gif';
        }
        return {
            width: files[fileKey].width,
            height: files[fileKey].height,
            src: `${window.entry__baseUrl}/${files[fileKey].src}`
        };
    }
    _getPlaceholderSize = () => {
        const { media, files } = this.props.data;
        const computedImageSrc = this._getImageSrc();
        const placeholderNode = this.placeholderNodeRef;
        console.log(placeholderNode, 'plc node');
        if (placeholderNode) {

        }
        return {
            width: 100,
            height: 100
        };
    }
    _onLargeImageLoad = () => {
        this.setState({
            imageLoaded: true
        });
    }
    render () {
        const { caption, files } = this.props.data;
        const { isPlaying, imageLoaded } = this.state;
        const baseNodeStyle = this._getBaseNodeStyle();
        return (
          <div
            ref={(baseNode) => { this.baseNodeRef = baseNode; }}
            style={baseNodeStyle}
          >
            <div
              className={`${styles.rootInner}`}
            >
              <div
                className={`${styles.image}`}
                onClick={this._handleImageClick}
              >
                {files.gif &&
                  <PlayIcon
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-48px',
                        marginLeft: '-48px',
                        fill: '#FFF',
                        color: 'rgba(255, 255, 255, 0.86)',
                        height: 96,
                        width: 96,
                        opacity: isPlaying ? 0 : 1,
                        filter: `blur(${isPlaying ? '3px' : '0'}) drop-shadow(0 0 2px #444)`,
                        transition: 'opacity 0.218s ease-in-out, blur 0.218s ease-in-out'
                    }}
                  />
                }
                <div
                  style={{
                      width: this._getImageSrc().width,
                      height: this._getImageSrc().height,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      position: 'relative',
                      opacity: imageLoaded ? 0 : 1,
                      display: imageLoaded ? 'none' : 'block',
                      transition: 'opacity .218s ease-in-out',
                      backgroundColor: '#F5F5F5'
                  }}
                  ref={(node) => { this.placeholderNodeRef = node; }}
                >
                  <img
                    src={`${window.entry__baseUrl}/${files.xs.src}`}
                    style={{
                        filter: 'blur(30px)',
                        transform: 'scale(1)',
                        position: 'absolute'
                    }}
                    alt=""
                  />
                </div>
                <img
                  src={this._getImageSrc().src}
                  alt=""
                  onLoad={this._onLargeImageLoad}
                  style={{
                      opacity: imageLoaded ? 1 : 0,
                      display: imageLoaded ? 'block' : 'none',
                  }}
                />
              </div>
              <div className={`${styles.caption}`} >
                <small>{caption}</small>
              </div>
            </div>
          </div>
        );
    }
}
ImageBlock.propTypes = {
    data: PropTypes.shape({
        files: PropTypes.shape(),
        caption: PropTypes.string,
        rightsHolder: PropTypes.string,
        media: PropTypes.string,
        licence: PropTypes.string,
        termsAccepted: PropTypes.bool
    }),
    width: PropTypes.number
};

export default withWidth({
    largeWidth: 1920,
    mediumWidth: 728,
    smallWidth: 320
})(ImageBlock);