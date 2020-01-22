import React, { Component } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity,StyleSheet, } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles';
import { Button, Container, } from 'native-base';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputComponent from '../components/InputComponent';
import Api from '../services/api';
import * as authAction from '../actions/authAction';


const { width, } = Dimensions.get('window');
const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 100,
    },
    wrapper: {
        padding: 30
    },
    heading: {
        color: colors.colorPrimary,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15
    },
    loginButton: {
        color: 'red',
        backgroundColor: colors.colorPrimary,
        elevation: 6,
        marginBottom: 20
    },
    loginText: {
        color: 'white'
    },
    icon: {
        color: colors.colorAccent,
        marginTop: 10,
        marginLeft: 20,
    },
    forgotPassword: {
        alignSelf: 'center',
        color: '#b5b5b5'
    },
    logoWrapper:{
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: width,
        marginTop: -10
    },
    drawerIconStyle: { 
        color: colors.colorAccent, 
        fontSize: 24 
    }
   
});

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this._onLogin = this._onLogin.bind(this);
    }

    async _onLogin() {
        //TODO: validations and other
        const { navigation, onLogin, setUser } = this.props;
        let cred = this.props.formData.values;

        try {
            let response = await Api.login(cred);
            
            onLogin(cred, response);
            let user = await Api.getProfile();
            setUser(user);
            navigation.navigate('AdminDashboard');
        } catch (err) {
            console.log(err);
        }
    }

    loginFields = [
        {name:"username", placeholder: "Username", icon: <Ionicons style={styles.icon} name="md-mail" size={20} />, component: InputComponent, },
        {name:"password", placeholder: "Password", icon: <Ionicons style={styles.icon} name="md-lock" size={20} />, component: InputComponent, secureTextEntry: true}
    ]

    render() {
        let canSubmit = true;
        const { navigation } = this.props;
        return (
            <Container>
                <View style={styles.overlayWrapper}>
                    <Image style={styles.logoWrapper} source={require('../assets/images/background.png')} resizeMode= 'cover'/>
                        <Image
                            style={styles.logo}
                            source={require('../assets/images/logo.png')}
                        />
                    
                    <View style={styles.overlay} />
                </View>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                >
                    <View style={styles.wrapper} >
                    <Text style={styles.heading}>Login</Text>
                    {this.loginFields.map((loginField, key) => {
                        return (
                            <Field key={loginField.name} {...loginField} />
                        );
                    })}
                        <Button full rounded style={styles.loginButton} onPress={this._onLogin} disabled={!canSubmit}>
                            <Text style={styles.loginText}>Submit</Text>
                        </Button>
                        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                            <Text style={styles.forgotPassword}>Forgot Your Password?</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </Container>
        );
    }

    static navigationOptions = () => ({
        title: 'Log In',
        header: null,
        drawerIcon: () => (<EntypoIcon name='circle-with-plus' style={styles.drawerIconStyle} />)
    });
}

const mapStateToProps = ({ auth, form }) => ({
    initialValues: auth.login,
    formData: form.login,
    isAuthenticated: auth.isAuthenticated,
    auth: auth.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
    onLogin: (cred, body) => {
        dispatch(authAction.hasLoggedin());
        dispatch(authAction.setLoginCred(cred));
        dispatch(authAction.setToken(body.access));
    },
    setUser: (user) => {
        dispatch(authAction.setUser(user));
    },
    onLogout: () => {
        dispatch(authAction.logout());
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'login' })(LoginScreen));
