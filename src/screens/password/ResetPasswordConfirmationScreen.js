import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles';
import { Button } from 'native-base';

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 32,
        paddingLeft: 32,
        paddingRight: 32,
        backgroundColor: colors.colorFaintGrey,
        minHeight: Dimensions.get('window').height,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    message: {
        color: colors.colorPrimaryGrey,
        fontWeight: 'bold',
        marginBottom: 11,
        fontSize: 16
    },
    button: {
        color: 'red',
        backgroundColor: colors.colorPrimary,
        elevation: 6,
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
    normalText: {
        color: colors.colorPrimaryGrey,
        marginBottom: 12,
        fontSize: 14
    },
    imageEmail: {
        marginBottom: 20,
        marginTop: 20
    },
    resendText: {
        marginBottom: 40,
        color: colors.colorPrimary,
        fontSize: 14
    },
    digitText: {
        color: colors.colorPrimaryGrey,
        marginBottom: 12,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    whiteText: {
        color: '#fff'
    }
});

export default class ResetPasswordConfirmationScreen extends Component {
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
                    We have sent you a confirmation email
                </Text>
                <Text style={styles.normalText}>
                    Please check your Email
                </Text>
                <Image source={require('../../assets/images/mail.png')} style={styles.imageEmail} />
                <Text style={styles.normalText}>
                    If you can't find the email
                </Text>
                <TouchableOpacity onPress={() => console.log('pressed')}>
                    <Text style={styles.resendText}>
                        Resend Confirmation Email
                    </Text>
                </TouchableOpacity>
                <Text style={styles.digitText}>Enter the 4-digit code to recover your Password</Text>
                <View style={styles.emailSection}>
                    <TextInput
                        onChangeText={(text) => this.updateEmail(text)}
                        value={this.state.email}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                    />
                </View>


                <Button full rounded style={styles.button} onPress={() => navigation.navigate('NewPassword')}>
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
