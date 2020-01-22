/**
 * RadioButtonComponent with validations on integration with redux-form
 */
import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Item, Label, Text, Input } from 'native-base';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

const styles = StyleSheet.create({
    formSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 33,

    },
});

const radio_props = [
    { label: 'Coach', value: 1 },
    { label: 'Admin', value: 0 }
];

export default class RadioButtonComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: 0, };
    }
    _onChange(value) {
        let { input } = this.props;
        this.setState({ value });
        input.onChange(value);
    }

    render() {
        let { input, secureTextEntry, label, items, placeholder, meta: { touched, error, warning } } = this.props;

        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        console.log('hasError,error');
        console.log(hasError, error);
        return (
            <View style={styles.formSection}>
                <RadioForm
                    radio_props={radio_props}
                    initial={0}
                    formHorizontal={true}
                    buttonColor={'#7d7d7d'}
                    labelStyle={{ fontSize: 14, color: '#4d4f50', paddingRight: 33, paddingLeft: 20 }}
                    borderWidth={0.5}
                    buttonSize={20}
                    selectedButtonColor={'#36b236'}
                    animation={true}
                    onPress={(value) => { this._onChange(value) }}
                />
                {hasError ? <Text style={{ position: 'absolute', bottom: 0, right: 0 }}>{error}</Text> : <Text />}
            </View>
        )
    }
}
