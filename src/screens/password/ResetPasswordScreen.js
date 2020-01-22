import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { Button } from 'native-base';

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 48,
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: colors.colorFaintGrey,
        minHeight: Dimensions.get('window').height
    },
    message: {
        color: colors.colorPrimaryGrey,
        fontWeight: 'bold',
        marginBottom: 34,
        fontSize: 14
    },
    button: {
        color: 'red',
        backgroundColor: colors.colorPrimary,
        elevation: 6,
    },
    mailIcon: {
        color: colors.colorAccent
    },
    emailSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginBottom: 35,
        borderColor: '#bebcbc',
    },
    input: {
        flex: 1,
        paddingLeft: 10,
        color: colors.colorSecondaryGrey,
        fontSize: 14
    },
    whiteText: {
        color: '#fff'
    }
});

export default class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
    }
    updateEmail = (text) => {
        this.setState({ email: text });
    }

    validate = () => {
        const { email } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            console.log("Email is Not Correct");
            return false;
        }
        else {
            console.log("Email is Correct");
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.wrapper}>
                <Text style={styles.message}>
                    Enter your email to recover your password
                </Text>
                <View style={styles.emailSection}>
                    <Ionicons style={styles.mailIcon} name="md-mail" size={20} />
                    <TextInput
                        placeholder="Email"
                        onChangeText={(text) => this.updateEmail(text)}
                        value={this.state.email}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                    />
                </View>


                <Button full rounded style={styles.button} onPress={() => navigation.navigate('ResetPasswordConfirmation')}>
                    <Text style={styles.whiteText}>Submit</Text>
                </Button>
            </View>
        );
    }

    static navigationOptions = () => ({
        title: 'Reset Password',
        headerRight: null
    });
}
