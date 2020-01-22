import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { colors } from '../../styles';
import { reduxForm, Field } from 'redux-form';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import PickerComponent from '../../components/PickerComponent';
import MultiselectComponent from '../../components/MultiselectComponent';
import CheckButtonComponent from '../../components/CheckButtonComponent';
import InputComponent from '../../components/InputComponent';
import DatePickerComponent from '../../components/DatePickerComponent';
import { camelToSnakeCaseKeys } from '../../utils/text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Api from '../../services/api';
import * as authAction from '../../actions/authAction';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icon: {
        color: colors.colorAccent,
        marginTop: 10,
        marginLeft: 20,
    },
    sIcon: {
        color: colors.colorAccent,
        marginTop: 10,
        marginLeft: 2
    },
    checkIcon: {
        color: 'white',
        paddingRight: 16
    },
    wrapper: {
        paddingHorizontal: 46,
        paddingVertical: 36
    },
    mIcon: {
        color: colors.colorAccent,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 20
    },
    textStyle: { 
        marginLeft: 20 
    },
    fieldView: { 
        paddingHorizontal: 30, 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    profileImage: {
        height: 90,
        width: 90,
        alignSelf: 'center',
        marginTop: 36,
        marginBottom: 10,
        borderRadius: 45,
    },
    editImageBtn: {
        alignSelf: 'center',
        marginBottom: 25,
        alignItems: 'center',
    },
});

const validate = values => {
    const error = {};
    error.username = '';
    error.email = '';
    error.first_name = '';
    error.last_name = '';
    error.code = '';
    error.mobile_number = '';
    error.street_address = '';
    error.password = '';
    error.repassword = '';
    var ema = values.email;
    var fnm = values.first_name;
    var lnm = values.last_name;
    var un = values.username;
    var code = values.code;
    if (!ema) {
        error.email = 'Required';
    } else if (ema.length < 8 && ema !== '') {
        error.email = 'too short';
    } else if (!ema.includes('@') && ema !== '') {
        error.email = '@ not included';
    }
    if (!fnm) {
        error.first_name = 'Required';
    } else if (fnm.length > 18) {
        error.first_name = 'max 18 characters';
    }

    if (!lnm) {
        error.last_name = 'Required';
    } else if (lnm.length > 18) {
        error.last_name = 'max 18 characters';
    }

    if (!un) {
        error.username = 'Required';
    } else if (un.length > 18) {
        error.username = 'max 18 characters';
    }

    if (!code) {
        error.code = 'Required';
    } else if (isNaN(Number(code))) {
        error.code = 'Enter number '
    }

    //to reduce the more boilerplate codes
    const rules = {
        mobile_number: ['required'],
        street_address: ['required'],
        password: ['required'],
        repassword: ['required'],
        expiration_date: ['required'],

    }

    for (let field in rules) {
        if (rules[field].includes('required') && (values[field] === '' || values[field] == undefined)) {
            error[field] = 'Required';
        }
    }

    return error;
};


class AdminCoachRegistrationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            countries: [],
            isReady: true,
            loading: false,
            progress: 0,
            image: null
        };
        this._adminSignup = this._adminSignup.bind(this);
        this.addPlayerFields = [
            { name: 'username', placeholder: 'User Name', icon: <Ionicons style={styles.icon} name='md-person' size={20} />, component: InputComponent, type: 'input', },
            { name: 'first_name', placeholder: 'First Name', icon: <Ionicons style={styles.icon} name='md-person' size={20} />, component: InputComponent, type: 'input', },
            { name: 'last_name', placeholder: 'Last Name', icon: <Ionicons style={styles.icon} name='md-person' size={20} />, component: InputComponent, type: 'input', },
            // { name: 'dob', placeholder: 'Date of Birth', icon: <Ionicons style={styles.sIcon} name='md-calendar' size={20} />, pickerProps: { minDate: "1918-01-01", maxDate: "2002-04-16" }, component: DatePickerComponent, type: 'input', },
            { name: 'expiration_date', placeholder: 'Expiration Date', icon: <Ionicons style={styles.sIcon} name='md-calendar' size={20} />, pickerProps: { minDate: "1918-01-01", maxDate: "2022-04-16" }, component: DatePickerComponent, type: 'input', },
            { name: 'code', placeholder: 'Code', icon: <Ionicons style={styles.icon} name='md-globe' size={20} />, component: InputComponent, type: 'input', },
            { name: 'email', placeholder: 'Email', icon: <Ionicons style={styles.icon} name='md-mail' size={20} />, component: InputComponent, type: 'input', },
            { name: 'mobile_number', placeholder: 'Mobile Number', icon: <Ionicons style={styles.icon} name='md-phone-portrait' size={20} />, component: InputComponent, type: 'input', },
            { name: 'street_address', placeholder: 'Street Address', icon: <Ionicons style={styles.icon} name='md-pin' size={20} />, component: InputComponent, type: 'input', },
            { name: 'password', placeholder: 'Password', icon: <Ionicons style={styles.icon} name='md-lock' size={20} />, component: InputComponent, type: 'input', secureTextEntry: true },
            { name: 'repassword', placeholder: 'Re-enter Password', icon: <Ionicons style={styles.icon} name='md-lock' size={20} />, component: InputComponent, type: 'input', secureTextEntry: true },
        ]
    }

    componentDidMount() {
        this.props.navigation.setParams({
            adminSignup: this._adminSignup,
        });
        this.loadCountry();
        this.loadTeam();

    }

    async loadCountry() {
        try {
            let res = await Api.country.list();
            this.setState({ countries: res.results });
        }
        catch (err) {
            console.log(err);
        }
    }
    async loadTeam() {
        try {
            let res = await Api.team.list();
            this.setState({ teams: res.results });
        }
        catch (err) {
            console.log(err);
        }
    }
    _onProgress = (progress) => {
        this.setState({ progress });
    }

    _adminSignup = async () => {
        this.setState({ loading: true });
        const { navigation, user, setUser } = this.props;
        const { image } = this.state;
        let formValues = this.props.formData.values;
        formValues.status = 'unverified';
        Object.keys(formValues).forEach(k => (!formValues[k] && formValues[k] !== undefined) && delete formValues[k]);
        delete formValues.image;
        delete formValues.certificate_file;
        if(image) {
            formValues.image={uri: image.path, type: image.mime, name: image.path.split('/').slice(-1)[0]}; //TODO use timestamp and team with extension from path
        }
        Api.user.createOrUpdate(formValues, this._onProgress).then((res) => {
            let updatedUser = JSON.parse(res);
            if (formValues.id === user.id) {
                setUser(updatedUser);
            }
            navigation.navigate((updatedUser.isStaff)?'AdminProfile':'CoachProfile',{ coach: updatedUser});
        }).catch(err => {
            console.log(err);
            this.setState({ progress: 0 });
        });
    }

    _uploadimage() {
        const options = {
            width: 300,
            height: 400,
            cropping: false
        };
        ImagePicker.openPicker(options).then(image => {
            this.setState({
                image: image
            });
        });
    }

    render() {
        const { image } = this.state;
        let user = this.props.navigation.state.params?.coach;
        let userImage = null;
        if (user) {
            userImage = user.image;
        }
        let imageSource;
        if (image && image.path) {
            imageSource = { uri: image.path };
        } else {
            imageSource = userImage?  { uri: userImage }: require('../../assets/images/person.png');
        }
        return (
            <KeyboardAwareScrollView style={styles.container}>
                <View style={styles.wrapper}>
                    <View>
                    <Image style={styles.profileImage} source={imageSource} />
                    <TouchableOpacity style={styles.editImageBtn} onPress={this._uploadimage.bind(this)}>
                        <Text style={styles.editImageText}> Add photo </Text>
                    </TouchableOpacity>
                    </View>
                    {this.addPlayerFields.map((addPlayerField, key) => {
                        if (addPlayerField.type === 'input') {
                            return (
                                <Field {...addPlayerField} />
                            );
                        }
                    })}
                    {!this.props.navigation.state.params?.coach &&
                        <View style={styles.fieldView}>
                            <Field
                                name='is_coach' component={CheckButtonComponent}
                                text={<Text style={styles.textStyle}>Coach</Text>}
                            />
                            <Field
                                name='is_staff' component={CheckButtonComponent}
                                text={<Text style={styles.textStyle}>Admin</Text>}
                            />
                        </View>
                    }
                    <Field
                        name='country'
                        // placeholder= 'Country' 
                        icon={<Ionicons style={styles.mIcon} name='md-pin' size={20} />}
                        component={PickerComponent}
                        items={this.state.countries}
                        type='input'
                    />
                    <Text>Assign to Team</Text>
                    <Field
                        name='teams'
                        component={MultiselectComponent}
                        uniqueKey='name'
                        items={this.state.teams}
                        type='input'
                    />
                </View>
            </KeyboardAwareScrollView>
        );
    }

    static getTitle(navigation) {
        if(navigation.state.params?.coach) {
            if(navigation.state.params?.coach?.isStaff){
                return 'Admin Edit'
            }
            else{
                return 'Coach Edit'
            }
            
        }
        else{
            return 'Admin/Coach Registration'
        } 
       
    }

    static navigationOptions = ({ navigation }) => ({
        title: AdminCoachRegistrationScreen.getTitle(navigation),
        headerRight: <MaterialCommunityIcons name="check" size={24} style={styles.checkIcon} onPress={() => navigation.state.params.adminSignup()} />
    });

}

const mapStateToProps = (state, props) => ({
    initialValues: camelToSnakeCaseKeys(props.navigation.state.params?.coach),
    formData: state.form.addAdmin,
    user: state.auth.user
})

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => {
        dispatch(authAction.setUser(user));
    },
});

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps)
);

export default enhance(reduxForm({
    form: 'addAdmin',
    validate
})(AdminCoachRegistrationScreen));
