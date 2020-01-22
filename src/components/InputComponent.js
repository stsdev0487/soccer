/**
 * InputComponent with validations on integration with redux-form
 */
import React from 'react';

import { View, StyleSheet } from 'react-native';

import { Item, Label, Text, Input } from 'native-base';

const styles = StyleSheet.create({
    formSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginBottom: 35,
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
    transparentWrapper: {
        borderColor: 'transparent'
    },
    inputContainer: { 
        color: '#707070' 
    },
    labelStyle: {
        color: '#b5b5b5',
        paddingLeft: 10,
        marginTop: -10
    },
});

export default class InputComponent extends React.Component {
    
    render() {
        let { input, secureTextEntry, icon, placeholder, disabled, meta: { touched, error, } } = this.props;

        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <View style={[styles.formSection,hasError && touched ? styles.mistake : styles.correct ]}>
                {icon}
                <Item style={styles.transparentWrapper} error={hasError} floatingLabel>
                    <Label style={styles.labelStyle}>{placeholder}</Label>
                    <Input style={styles.inputContainer} {...input} value={String(input.value)} secureTextEntry={secureTextEntry} disabled={disabled} />
                </Item>
                {hasError && touched ? <Text style={styles.errorText}>{error}</Text> : <Text />}
            </View>
        )
    }
}
