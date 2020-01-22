/**
 * CheckButtonComponent with validations on integration with redux-form
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, } from 'native-base';
import RoundCheckbox from 'rn-round-checkbox';


const styles = StyleSheet.create({
    checkButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    container: {
        flexDirection: 'row',
    },
    errorContainer: { 
        position: 'absolute', 
        bottom: 0, 
        right: 0 
    }
});

export default class CheckButtonComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: props.input.value,

        };
    }

    _onChange = () => {
        let { input } = this.props;
        let checked = this.state.checked;
        this.setState({ checked: !checked });
        input.onChange(!(!!checked));
    }
    render() {
        let { text, meta: { error, } } = this.props;

        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <View style={styles.checkButton}>
                {/* <Label style={{ color: '#b5b5b5', marginLeft: 10, marginTop: 8 }}>{placeholder}</Label> */}
                <View style={styles.container}>
                    <RoundCheckbox
                        size={24}
                        checked={this.state.checked}
                        onValueChange={this._onChange}
                    />
                    {text}
                </View>
                {hasError ? <Text style={styles.errorContainer}>{error}</Text> : <Text />}
                {/* <View style={{ height: 1, backgroundColor: 'black', marginLeft: 15 }} /> */}
            </View>
        );
    }
}
