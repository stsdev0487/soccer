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
        borderColor: '#bebcbc',
    },
    inputContainer: {
        height: 119,
        borderColor: '#c8c8c8',
        borderWidth: 1,
        fontSize: 14,
        borderRadius: 4,
        textAlignVertical: 'top'
    },
    transparentWrapper: {
        borderColor: 'transparent'
    },
    labelStyle: {
        color: '#b5b5b5',
        paddingLeft: 10,
        marginTop: -10
    },
    errorText: { 
        position: 'absolute', 
        bottom: 0, 
        right: 0 
    }
});

export default class DescriptionInput extends React.Component {

    render() {
        let { input, secureTextEntry, icon, placeholder, meta: { touched, error, } } = this.props;

        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <View>
                <View style={styles.formSection}>
                    {icon}
                    <Item style={styles.transparentWrapper} error={hasError} floatingLabel>
                        <Label style={styles.labelStyle}>{placeholder}</Label>
                    </Item>
                    {hasError && touched ? <Text style={styles.errorText}>{error}</Text> : <Text />}
                </View>
                <Input style={styles.inputContainer}
                    multiline={true}
                    {...input} secureTextEntry={secureTextEntry} />
            </View>

        )
    }
}
