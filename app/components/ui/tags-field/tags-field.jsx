import React from 'react';
import { TextField, Chip } from 'material-ui';

class TagsField extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currentTags: props.tags || [],
            existentTags: props.existentTags || [],
            tagString: ''
        };
    }

    getTags = () => this.state.currentTags

    _checkTagAutocomplete = (value) => {
        this.props.onRequestTagAutocomplete(value);
    }
    _handleInputChange = (ev) => {
        if (ev.target.value.length >= 3) {
            this._checkTagAutocomplete(ev.target.value);
        }
        this.setState({
            tagString: ev.target.value,
        });
    }
    _handleDeleteTag = (ev, index) => {
        const currentTags = this.state.currentTags.slice();
        currentTags.splice(index, 1);
        this.setState({
            currentTags
        });
    }
    _createError = (error, removeCurrentTag) => {
        this.setState({
            error
        });
        if (removeCurrentTag) {
            this.setState({
                tagString: ''
            });
        }
    }
    _createTag = () => {
        const currentTags = this.state.currentTags;
        const tag = this.state.tagString.trim().toLowerCase();
        const ALPHANUMERIC_REGEX = /^[a-z0-9-]+$/i;
        if (currentTags.indexOf(tag) !== -1) {
            return this._createError(`Tag "${tag}" already added!`, true);
        }
        if (tag.length > 2 && tag.length <= 24) {
            if (ALPHANUMERIC_REGEX.test(tag)) {
                currentTags.push(tag);
                this.state.error = '';
                if (this.props.onTagAdded) {
                    this.props.onTagAdded(tag);
                }
            } else {
                this._createError('Tags can contain only letters, numbers and dashes (-).', false);
            }
        } else if (tag.length >= 25) {
            this._createError('Tags can have maximum 24 characters.', false);
        } else {
            this._createError('Tags should have at least 3 characters.', false);
        }
        return null;
    }
    _handleTagDetect = (ev) => {
        const MODIFIER_CHARCODES = [13, 32, 44, 59];
        for (let i = 0; i < MODIFIER_CHARCODES.length; i++) {
            if (ev.charCode === MODIFIER_CHARCODES[i]) {
                ev.preventDefault();
                this._createTag();
                this.setState({
                    tagString: ''
                });
            }
        }
    }
    // _handleBlur = (ev) => {
    //     const value = ev.target.value;
    //     if (value.length > 0) {
    //         this.setState({
    //             tagString: value
    //         }, this._createTag);
    //     }
    // }
    render () {
        const currentTags = this.state.currentTags;
        const tags = currentTags.map((tag, key) => (
          <Chip
            key={key}
            onRequestDelete={(ev) => { this._handleDeleteTag(ev, key); }}
            backgroundColor="transparent"
            title="Tag exists in the network"
            style={{
                display: 'inline-block',
                border: '1px solid',
                borderColor: '#74cc00',
                borderRadius: 3,
                height: 34,
                verticalAlign: 'middle',
                marginRight: '4px',
                marginBottom: '4px',
            }}
            labelStyle={{ lineHeight: '32px', display: 'inline-block', verticalAlign: 'top' }}
          >
            {tag}
          </Chip>
            )
        );
        return (
          <TextField
            fullWidth
            id="tags"
            multiLine
            style={{ lineHeight: 'inherit', height: 'inherit', marginBottom: '24px' }}
            errorText={this.state.error}
            underlineStyle={{ bottom: '-4px' }}
            errorStyle={{ bottom: '-18px' }}
            disabled={currentTags >= 10}
            onChange={this._handleInputChange}
            value={this.state.tagString}
          >
            <div>
              {tags}
              <input
                style={{
                    display: 'inline-block',
                    outline: 'inherit',
                    border: 'inherit',
                    verticalAlign: 'middle',
                    height: '32px',
                    width: '250px',
                    opacity: (currentTags.length >= 10) ? 0 : 1
                }}
                type="text"
                onChange={this._handleInputChange}
                value={this.state.tagString}
                placeholder={
                    currentTags.length < 3 ?
                    `add a tag (${3 - currentTags.length} free remaining)` :
                    'add a tag (paid)'
                }
                onKeyPress={this._handleTagDetect}
                disabled={currentTags.length >= 10}
              />
            </div>
          </TextField>
        );
    }
}
TagsField.propTypes = {
    tags: React.PropTypes.array,
    onTagAdded: React.PropTypes.func,
    existentTags: React.PropTypes.array,
    onRequestTagAutocomplete: React.PropTypes.func
};

export default TagsField;