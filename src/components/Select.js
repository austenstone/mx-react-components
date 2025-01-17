const _isEqual = require('lodash/isEqual');
const _includes = require('lodash/includes');
const keycode = require('keycode');
const PropTypes = require('prop-types');
const Radium = require('radium');
const React = require('react');

import { css } from '@mxenabled/cssinjs'
import { withTheme } from './Theme';
const Icon = require('./Icon');
const SearchInput = require('./SearchInput')
const { Listbox, Option } = require('./accessibility/Listbox');

const { themeShape } = require('../constants/App');

const StyleUtils = require('../utils/Style');

// returns a function that takes a click event, stops it, then calls the callback
const haltEvent = callback => e => {
  e.preventDefault();
  e.stopPropagation();
  callback();
};

const optionShape = PropTypes.shape({
  displayValue: PropTypes.any.isRequired,
  icon: PropTypes.any,
  value: PropTypes.any.isRequired
});

class Select extends React.Component {
  static propTypes = {
    dropdownStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    elementRef: PropTypes.func,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(optionShape),
    optionsStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    optionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    optionTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    placeholderText: PropTypes.string,
    scrimStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    selected: optionShape,
    selectedStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    theme: themeShape,
    valid: PropTypes.bool,
    withSearch: PropTypes.bool,
  };

  static defaultProps = {
    onChange () {},
    options: [],
    placeholderText: 'Select One',
    valid: true,
    withSearch: false,
  };

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      selected: props.selected,
      searchTerm: "",
    };

    this.optionListRef = React.createRef();
  }

  UNSAFE_componentWillReceiveProps (newProps) {
    if (!_isEqual(newProps.selected, this.props.selected)) {
      this.setState({ selected: newProps.selected });
    }
  }

  _handleKeyDown = (e) => {
    switch (keycode(e)) {
      case 'esc':
        e.preventDefault();
        e.stopPropagation();
        this._close();
        break;
      case 'enter':
      case 'space':
        if (this.state.isOpen) return;
        e.preventDefault();
        e.stopPropagation();
        this._open();
        break;
    }
  };

  _close = () => {
    this.setState({ isOpen: false, searchTerm: "" });
    this.elementRef.focus();
  };

  _open = () => {
    this.setState({ isOpen: true });
  };

  _handleOptionClick = (option) => {
    this.setState({ selected: option }, () => {
      this._close();
      this.props.onChange(option);
    });
  };

  _scrollListDown = (nextIndex) => {
    const ul = this.optionList.current;
    const activeLi = ul.children[nextIndex];
    const heightFromTop = nextIndex * activeLi.clientHeight;

    if (heightFromTop > ul.clientHeight) {
      ul.scrollTop = activeLi.offsetTop - activeLi.clientHeight;
    }
  };

  _scrollListUp = (prevIndex) => {
    const ul = this.optionList.current;
    const activeLi = ul.children[prevIndex];
    const heightFromBottom = (this.props.options.length - prevIndex) * activeLi.clientHeight;

    if (heightFromBottom > ul.clientHeight) {
      ul.scrollTop = activeLi.offsetTop - activeLi.clientHeight;
    }
  };

  _renderScrim = (styles) => {
    if (this.state.isOpen) {
      return (
        <div
          className='mx-select-scrim'
          onClick={haltEvent(this._close)}
          style={[styles.scrim, this.props.scrimStyle]}
        />
      );
    } else {
      return null;
    }
  };

  _onSearchInputChange = e => {
    this.setState({ searchTerm: e.target.value.toLowerCase() })
  }

  _renderOptions = (styles) => {
    if (this.state.isOpen) {
      if (this.props.children) {
        return (
          <div className='mx-select-options' style={styles.options}>
            {typeof this.props.children === 'function' ? this.props.children({ onOptionClick: this._handleOptionClick }) : this.props.children}
          </div>
        );
      } else {
        return (
          <Listbox
            aria-label={this.props.placeholderText}
            className='mx-select-options'
            ref={this.optionListRef}
            style={styles.options}
            withSearch={this.props.withSearch}
          >
            {this.props.withSearch && 
              <SearchInput
                focusOnLoad={true}
                onChange={this._onSearchInputChange}
              />}
            {this.props.options
              .filter(option => this.state.searchTerm ? _includes(option.displayValue.toLowerCase(), this.state.searchTerm) : true)
              .map(option => {
                return (
                  <Option
                    className='mx-select-option'
                    isSelected={_isEqual(option, this.state.selected)}
                    key={option.displayValue + option.value}
                    label={option.displayValue}
                    onClick={haltEvent(this._handleOptionClick.bind(null, option))}
                    style={Object.assign({},
                      styles.option,
                      this.props.optionStyle
                    )}
                  >
                    {option.icon ? (
                      <Icon
                        size={20}
                        style={styles.optionIcon}
                        type={option.icon}
                      />
                    ) : null}
                    <div style={styles.optionText}>{option.displayValue}</div>
                    {_isEqual(option, this.state.selected) ? <Icon size={20} type='check' /> : null }
                  </Option>
                );
              }
            )}
          </Listbox>
        );
      }
    } else {
      return null;
    }
  };

  render () {
    const theme = StyleUtils.mergeTheme(this.props.theme);
    const styles = this.styles(theme);
    const selected = this.state.selected || this.props.selected || { displayValue: this.props.placeholderText, value: '' };

    return (
      <div className='mx-select' style={Object.assign({}, this.props.style, { position: 'relative' })}>
        <div className='mx-select-custom'
          className={css(styles.component)}
          onClick={haltEvent(this._open)}
          onKeyDown={this._handleKeyDown}
          ref={ref => {
            this.elementRef = ref;
            if (typeof this.props.elementRef === 'function') this.props.elementRef(ref);
          }}
          role='button'
          tabIndex={0}
        >
          {this._renderScrim(styles)}
          <div className='mx-select-selected' key='selected' style={styles.selected}>
            {selected.icon ? (
              <Icon
                size={20}
                style={styles.optionIcon}
                type={selected.icon}
              />
            ) : null}
            <div style={styles.optionText}>{selected.displayValue}</div>
            <Icon
              size={20}
              type={this.state.isOpen ? 'caret-up' : 'caret-down'}
            />
          </div>
          {this.props.options.length || this.props.children ? this._renderOptions(styles) : null}
        </div>
      </div>
    );
  }

  styles = (theme) => {
    const focusedOption = {
      backgroundColor: theme.Colors.PRIMARY,
      color: theme.Colors.WHITE,
      fill: theme.Colors.WHITE
    };

    return {
      component: Object.assign({},
        {
          backgroundColor: theme.Colors.WHITE,
          borderRadius: 3,
          border: '1px solid ' + theme.Colors.GRAY_300,
          cursor: 'pointer',
          fontFamily: theme.FontFamily,
          fontSize: theme.FontSizes.MEDIUM,
          padding: '8px 10px',
          position: 'relative',
          boxSizing: 'border-box',
          '&:focus': {
            outline: 'dotted thin ' + theme.Colors.GRAY_900,
            outlineOffset: '1px'
          }
        }, this.props.dropdownStyle),
      select: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        opacity: 0
      },
      selected: Object.assign({},
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }, this.props.selectedStyle),
      invalid: {
        borderColor: theme.Colors.DANGER
      },
      options: Object.assign({},
        {
          backgroundColor: theme.Colors.WHITE,
          border: '1px solid ' + theme.Colors.GRAY_300,
          borderRadius: '0 0 3px 3px',
          left: -1,
          right: -1,
          margin: '8px 0 0 0',
          padding: 0,
          minWidth: '100%',
          position: 'absolute',
          zIndex: 10,
          fontSize: 12,
          boxShadow: theme.ShadowHigh,
          boxSizing: 'border-box',
          maxHeight: 260,
          overflow: 'auto'
        }, this.props.optionsStyle),
      option: {
        display: 'flex',
        alignItems: 'center',
        color: theme.Colors.GRAY_700,
        cursor: 'pointer',
        backgroundColor: theme.Colors.WHITE,
        outline: 'none',
        padding: 10,
        whiteSpace: 'nowrap',

        '&:focus': focusedOption,
        '&:hover': focusedOption
      },
      optionIcon: {
        marginRight: 5
      },
      optionText: Object.assign({},
        {
          flex: '1 0 0%'
        }, this.props.optionTextStyle),
      scrim: {
        position: 'fixed',
        zIndex: 9,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    };
  };
}


module.exports = withTheme(Radium(Select));
