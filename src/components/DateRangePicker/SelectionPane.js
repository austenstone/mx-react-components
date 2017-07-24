const React = require('react');
const moment = require('moment');
const PropTypes = require('prop-types');

const DefaultRanges = require('../DateRangePicker/DefaultRanges');

const StyleConstants = require('../../constants/Style');
const { SelectedBox } = require('../../constants/DateRangePicker');

class SelectionPane extends React.Component {
  static propTypes = {
    currentDate: PropTypes.string,
    defaultRanges: PropTypes.array,
    onDateBoxClick: PropTypes.func,
    primaryColor: PropTypes.string,
    selectedBox: PropTypes.string,
    selectedEndDate: PropTypes.number,
    selectedStartDate: PropTypes.number,
    setCurrentDate: PropTypes.func
  };

  _handleDateBoxClick = (date, selectedBox) => {
    this.props.onDateBoxClick(date, selectedBox);
  }

  render () {
    const styles = this.styles();
    const { selectedStartDate, selectedEndDate } = this.props;

    return (
      <div style={styles.container}>
        <div>
          <label style={styles.boxLabel}>From</label>
          <div onClick={() => this._handleDateBoxClick(selectedStartDate, SelectedBox.FROM)} style={Object.assign({}, styles.dateSelectBox, this.props.selectedBox === SelectedBox.FROM ? styles.selectedDateSelectBox : null)}>{selectedStartDate ? moment.unix(selectedStartDate).format('MMM D, YYYY') : 'Select Start Date'}</div>

          <label style={styles.boxLabel}>To</label>
          <div onClick={() => this._handleDateBoxClick(selectedEndDate, SelectedBox.TO)} style={Object.assign({}, styles.dateSelectBox, this.props.selectedBox === SelectedBox.TO ? styles.selectedDateSelectBox : null)}>{selectedEndDate ? moment.unix(selectedEndDate).format('MMM D, YYYY') : 'Select End Date'}</div>
        </div>
        <div>
          <div style={Object.assign({}, styles.defaultRangesTitle, { color: this.props.primaryColor })}>
            Select a Range
          </div>
          <DefaultRanges {...this.props} styles={styles} />
        </div>
      </div>
    );
  }

  styles = () => {
    const isLargeOrMediumWindowSize = ['large', 'medium'].indexOf(StyleConstants.getWindowSize()) !== -1;

    return {
      container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRight: isLargeOrMediumWindowSize ? '1px solid ' + StyleConstants.Colors.FOG : 'none',
        padding: StyleConstants.Spacing.MEDIUM,
        boxSizing: 'border-box',
        width: isLargeOrMediumWindowSize ? 275 : '100%'
      },
      calendarHeaderNav: {
        width: 35,
        cursor: 'pointer'
      },

      boxLabel: {
        fontFamily: StyleConstants.FontFamily,
        fontSize: StyleConstants.FontSizes.MEDIUM,
        color: StyleConstants.Colors.CHARCOAL
      },
      dateSelectBox: {
        borderColor: StyleConstants.Colors.FOG,
        borderRadius: 3,
        borderStyle: 'solid',
        borderWidth: 1,
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontFamily: StyleConstants.FontFamily,
        fontSize: StyleConstants.FontSizes.MEDIUM,
        marginBottom: StyleConstants.Spacing.SMALL,
        marginTop: StyleConstants.Spacing.XSMALL,
        padding: '10px 15px'
      },
      selectedDateSelectBox: {
        borderColor: this.props.primaryColor,
        cursor: 'pointer',
        color: this.props.primaryColor
      },

      //Default Ranges
      defaultRangesTitle: {
        color: StyleConstants.Colors.PRIMARY,
        fontFamily: StyleConstants.Fonts.SEMIBOLD,
        fontSize: StyleConstants.FontSizes.SMALL,
        padding: `${StyleConstants.Spacing.LARGE}px 0px ${StyleConstants.Spacing.SMALL}px ${StyleConstants.Spacing.LARGE}px`
      },
      rangeOptions: {
        boxSizing: 'border-box',
        color: StyleConstants.Colors.CHARCOAL,
        display: 'flex',
        flexWrap: 'wrap',
        fontSize: StyleConstants.FontSizes.MEDIUM,
        width: '100%'
      },
      rangeOption: {
        alignItems: 'center',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        padding: `${StyleConstants.Spacing.SMALL}px ${StyleConstants.Spacing.SMALL}px`,
        width: '50%',
        fontSize: StyleConstants.FontSizes.SMALL,

        ':hover': {
          backgroundColor: StyleConstants.Colors.PORCELAIN
        }
      },
      rangeOptionIcon: {
        paddingRight: StyleConstants.Spacing.SMALL
      }

    };
  }
}

module.exports = SelectionPane;
