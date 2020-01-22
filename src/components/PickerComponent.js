/**
 * PickerComponent with validations on integration with redux-form
 */
import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Label, Text, Picker, } from 'native-base';

const styles = StyleSheet.create({
  form: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 30,
    alignItems: 'center',
    borderColor: '#bebcbc',
  },
  mistake: {
    borderColor: '#ff0000',
  },
  correct: {
    borderColor: '#bebcbc',
  },
  errorText: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 10,
    color: '#ff0000'
  },
  labelStyle: {
    fontSize: 16,
    color: '#b5b5b5',
    left: 28,
    position: 'absolute',
  },
  note: {
    color: '#b5b5b5'
  },
  viewStyle: {
    height: 1,
    backgroundColor: 'black',
    marginLeft: 15
  }
});

export default class PickerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { itemValue: props.input.value };
  }
  _onChange(itemValue) {
    let { input } = this.props;
    this.setState({ itemValue });
    input.onChange(itemValue);
  }

  render() {
    let { label, icon, items, placeholder, meta: { touched, error, } } = this.props;

    var hasError = false;
    if (error !== undefined) {
      hasError = true;
    }


    return (
      <View style={{}}>
        <Label style={styles.labelStyle}>{label}</Label>
        <View style={[styles.form, hasError && touched ? styles.mistake : styles.correct]}>
          {icon}


          <Picker
            style={Platform.select({
              android: {
                marginLeft: 0,
                marginTop: 16,
                color: '#b5b5b5',
              },
              ios: {
                marginLeft: 0,
                marginTop: 16,
              }
            })}
            noteStyle={styles.note}
            placeholder={placeholder || 'Select item'}
            mode="dropdown"
            // note={true}
            selectedValue={this.state.itemValue}
            onValueChange={this._onChange.bind(this)}
          >
            {
              items.map(item => {
                return <Picker.Item
                  label={item.name} value={item.id} key={item.id} />
              })
            }
          </Picker>
          {hasError && touched ? <Text style={styles.errorText}>{error}</Text> : <Text />}
          <View style={styles.viewStyle} />
        </View>
      </View>
    );
  }
}
