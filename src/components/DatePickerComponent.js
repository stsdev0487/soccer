/**
 * DatePickerComponent with validations on integration with redux-form
 */
import React from 'react';
import DatePicker from 'react-native-datepicker';
import { View, StyleSheet } from 'react-native';
import { Label, Text, } from 'native-base';
import moment from 'moment';

const styles = StyleSheet.create({
  formDate: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 35,
    borderColor: '#bebcbc',
  },
  errorText: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 10,
    color: '#ff0000'
  },
  labelContainer: {
    color: '#b5b5b5',
    marginLeft: 10,
    marginTop: 8
  },
  picker: {
    width: 200
  },
  viewStyle: {
    height: 1,
    backgroundColor: 'black',
    marginLeft: 15
  }
});

export default class DatePickerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { date: props.input.value?moment(props.input.value).format('MM-DD-YYYY'):null };
  }
  _onChange = (date) => {
    let { input } = this.props;
    this.setState({ date });
    input.onChange(this.changeDateFormat(date));
  }
  changeDateFormat(date) {
    let dateArray = date.split("-");
    let newDateArray = [dateArray[2], dateArray[0], dateArray[1]];
    return newDateArray.join('-');
  }
  render() {
    let { pickerProps = {}, icon, placeholder, meta: { error, } } = this.props;

    var hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    return (
      
      <View style={styles.formDate}>
        {icon}
        <Label style={styles.labelContainer}>{placeholder}</Label>
        <DatePicker
          {...pickerProps}
          style={styles.picker}
          date={this.state.date}
          mode="date"
          placeholder="Select Date"
          format="MM-DD-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          customStyles={{
            dateInput: {
              alignItems: 'flex-start',
              marginLeft: 16,
              borderWidth: 0
            },
            placeholderText: {
              fontSize: 16,
              color: '#b5b5b5'
            },
            dateText: {
              fontSize: 16,
              color: '#b5b5b5',
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={this._onChange}
        />
        {hasError ? <Text style={styles.errorText}>{error}</Text> : <Text />}
        <View style={styles.viewStyle} />
      </View>
    );
  }
}
