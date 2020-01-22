/**
 * TextareaComponent with validations on integration with redux-form
 */
import React from 'react';

import { View, StyleSheet, TextInput } from 'react-native';

import { Item, Label, Text, Textarea } from 'native-base';

const styles = StyleSheet.create({
  formSection: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: '#bebcbc',
    marginBottom: 35,
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
  transparentWrapper: {
    borderColor: 'transparent',
  },
  inputContainer: {
    color: '#707070',
  },
  labelStyle: {
    color: '#b5b5b5',
    paddingLeft: 10,
  },
  textareaLabel: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default class TextareaComponent extends React.Component {

  render() {
    let { input, icon, placeholder, meta: { touched, error, } } = this.props;

    var hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    return (
      <View style={[styles.formSection, hasError && touched ? styles.mistake : styles.correct]}>
        <View style={styles.textareaLabel}>
          {icon}
          <Label style={styles.labelStyle}>{placeholder}</Label>
        </View>

        <Textarea rowSpan={5} style={styles.inputContainer} {...input} value={String(input.value)} />
        {hasError && touched ? <Text style={styles.errorText}>{error}</Text> : <Text />}
      </View>
    )
  }
}
