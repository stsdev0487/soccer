import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'native-base';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import InputComponent from '../../components/InputComponent';
import PickerComponent from '../../components/PickerComponent';
import MultiselectComponent from '../../components/MultiselectComponent';
import SingleSelectComponent from '../../components/SingleSelectComponent';
import DatePickerComponent from '../../components/DatePickerComponent';
import { camelToSnakeCaseKeys } from '../../utils/text';
import Api from '../../services/api';
import FilePreview from '../../components/FilePreview';

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    icon: {
        color: colors.colorAccent,
        marginTop: 10,
        marginLeft: 20,
    },
    editImageText: {
        color: '#1b75bc',
        fontSize: 12
    },
    checkIcon: {
        color: 'white',
        paddingRight: 16
    },
    wrapper: {
        padding: 30,
    },
    saveBtn: {
        elevation: 6,
        marginBottom: 20,
        paddingHorizontal: 21
    },
    saveText: {
        color: 'white'
    },
    sIcon: {
        color: colors.colorAccent,
        marginTop: 10,
        marginLeft: 2
    },
    mIcon: {
        color: colors.colorAccent,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 20
    },
    uploadView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    uploadText: {
        color: '#1b75bc',
        fontSize: 14
    },
    footerButtons: {
        flexDirection: 'row',
    },
    uploadIcon: {
        marginLeft: 18,
        color: colors.colorAccent,
    }


});

const validate = values => {
    console.log(values);
    const error = {};
    error.email = '';
    error.first_name = '';
    error.last_name = '';
    error.state_zipcode='';
    error.id='';
    var ema = values.email;
    var fnm = values.first_name;
    var lnm = values.last_name;
    var zipCode = values.state_zipcode;
    var code = values.id;
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
    if(!zipCode){
        error.state_zipcode = 'Required';
    } else if(isNaN(Number(zipCode))) {
        error.state_zipcode = 'Enter a Valid ZipCode';
    }

    //to reduce the more boilerplate codes
    const rules = {
        mobile: ['required'],
        code: ['required'],
        parent_name: ['required'],
        jersey_number: ['required'],
        // mother_name: ['required'],
        dob: ['required'],
        // position: ['required'],
        expiration_date: ['required'],
        street_address: ['required'],
        state_zipcode: ['required'],
        country: ['required'],
        club: ['required'],
        teams: ['required'],
    }

    for (let field in rules) {
        if (rules[field].includes('required') && (values[field] === '' || values[field] == undefined)) {
            error[field] = 'Required';
        }
    }

    return error;
};

class RegisterNewPlayerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clubs: [],
            teams:[],
            countries: [],
            gender: [{
                id: 'male',
                name: 'Male'
            }, {
                id: 'female',
                name: 'Female'
            }],
            isReady: true,
            loading: false,
            files: []
        };

        this.loadCountry = this.loadCountry.bind(this);
        this.loadTeam = this.loadTeam.bind(this);
        this.loadClub = this.loadClub.bind(this);
        this._uploadimage = this._uploadimage.bind(this);


        this.addPlayerFields = [
            { name: 'first_name', placeholder: 'First Name', icon: <Ionicons style={styles.icon} name='md-person' size={20} />, component: InputComponent, type: 'input', },
            { name: 'last_name', placeholder: 'Last Name', icon: <Ionicons style={styles.icon} name='md-person' size={20} />, component: InputComponent, type: 'input', },
            { name: 'dob', placeholder: 'Date of Birth', icon: <Ionicons style={styles.sIcon} name='md-calendar' size={20} />, pickerProps: { minDate: "1918-01-01", maxDate: "2002-04-16" }, component: DatePickerComponent, type: 'input', },
            { name: 'certificate_file', type: 'upload', },
            { name: 'code', placeholder: 'Player code', icon: <Ionicons style={styles.icon} name='md-contact' size={20} />, component: InputComponent, type: 'input', },
            { name: 'position', placeholder: 'Position', icon: <Ionicons style={styles.icon} name='md-contact' size={20} />, component: InputComponent, type: 'input', },
            { name: 'jersey_number', placeholder: 'Jersey Number', icon: <Ionicons style={styles.icon} name='md-contact' size={20} />, component: InputComponent, type: 'input', },
            { name: 'expiration_date', placeholder: 'Expiration Date', icon: <Ionicons style={styles.sIcon} name='md-calendar' size={20} />, pickerProps: { minDate: "1918-01-01", maxDate: "2022-04-16" }, component: DatePickerComponent, type: 'input', },
            { name: 'parentName', placeholder: 'Parent Name', icon: <Ionicons style={styles.icon} name='md-person' size={20} />, component: InputComponent, type: 'input', },
            { name: 'mobile', placeholder: 'Mobile Number', icon: <Ionicons style={styles.icon} name='md-phone-portrait' size={20} />, component: InputComponent, type: 'input', },
            { name: 'email', placeholder: 'Email', icon: <Ionicons style={styles.icon} name='md-mail' size={20} />, component: InputComponent, type: 'input', },
            { name: 'street_address', placeholder: 'Street Address', icon: <Ionicons style={styles.icon} name='md-pin' size={20} />, component: InputComponent, type: 'input', },
            { name: 'state_zipcode', placeholder: 'State Zip Code', icon: <Ionicons style={styles.icon} name='md-pin' size={20} />, component: InputComponent, type: 'input', },
        ]
    }

    componentDidMount() {
        this.props.navigation.setParams({
            playerSignup: this._playerSignup,
        });
        this.loadCountry();
        this.loadClub();
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

    async loadClub() {
        try {
            let res = await Api.club.list();
            this.setState({ clubs: res.results });
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

    _onProgress = (progress)=> {
        this.setState({progress});
    }

    _playerSignup = async () => {
        this.setState({ loading: true });
        const { image, files } = this.state;
        const { navigation } = this.props;
        let formValues = this.props.formData.values;
        formValues.status = 'unverified';
        delete formValues.image;
        delete formValues.certificate_file;
        Object.keys(formValues).forEach(k => (!formValues[k] && formValues[k] !== undefined) && delete formValues[k]);
        if(image) {
            formValues.image={uri: image.path, type: image.mime, name: image.path.split('/').slice(-1)[0]}; //TODO use timestamp and team with extension from path
        }
        if(files.length>0) {
            let file = files[0];
            formValues.certificate_file =  {uri: file.fileUri, type: file.fileType, name: file.fileName };
        }
        Api.player.createOrUpdate(formValues, {
            onProgress: this._onProgress
        }).then(() => {
            navigation.navigate('Players');
        }).catch((err)=>{
            console.log(err);
            this.setState({progress: 0});
        });
    }

    _uploadFile() {
        //Opening Document Picker
        DocumentPicker.show(
            {
                filetype: [DocumentPickerUtil.allFiles()],
                //All type of Files DocumentPickerUtil.allFiles()
                //Only PDF DocumentPickerUtil.pdf()
                //Audio DocumentPickerUtil.audio()
                //Plain Text DocumentPickerUtil.plainText()
            },
            (error, res) => {
                this.setState({
                    files: [{ 
                        fileUri: res.uri,
                        fileType: res.type,
                        fileName: res.fileName,
                        fileSize: res.fileSize,
                    }]
                });
            }
        );
    }

    _removeFile = (fileIndex) => {
        let {files} = this.state;
        files.splice(fileIndex, 1);
        this.setState({files});
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
        const { image, files } = this.state;
        let selectedClub = this.props.formData && this.props.formData.values && this.props.formData.values.club;
        let filteredTeam = this.state.teams.filter(team => team.club.id===selectedClub);
        let player = this.props.navigation.state.params?.player;
        let playerImage = null;
        if (player) {
            playerImage = player.image;
        }
        let imageSource;
        if (image && image.path) {
            imageSource = { uri: image.path };
        } else {
            imageSource = playerImage?  { uri: playerImage }: require('../../assets/images/person.png');
        }
        return (
            <KeyboardAwareScrollView style={styles.container}>
                <Image style={styles.profileImage} source={imageSource} />
                <TouchableOpacity style={styles.editImageBtn} onPress={this._uploadimage.bind(this)}>
                    <Text style={styles.editImageText}> Add photo </Text>
                </TouchableOpacity>
                <View style={styles.wrapper}>
                    {this.addPlayerFields.map((addPlayerField) => {
                        if (addPlayerField.type === 'input') {
                            return (
                                <Field key={addPlayerField.name} {...addPlayerField} />
                            );
                        } else if (addPlayerField.type === 'upload') {
                            return (
                                <View>
                                    <View style={styles.uploadView}>
                                        <Text style={styles.uploadText}>Upload Birth Certificate or Passport</Text>
                                        <Ionicons style={styles.uploadIcon} name='md-cloud-upload' size={32}
                                            onPress={this._uploadFile.bind(this)} />
                                    </View>
                                    {
                                        files.length > 0 &&
                                        <FilePreview files={files} removeFile={this._removeFile}/>
                                    }
                                </View>
                            );
                        }
                    })}
                    <Field 
                        name= 'gender' 
                        label='Gender'
                        placeholder='Select Gender'
                        icon= {<Ionicons style={styles.mIcon} name='md-pin' size={20} />} 
                        component= {PickerComponent}
                        items= {this.state.gender}
                        type= 'input'
                    />
                    <Field 
                        name= 'country' 
                        label='Country'
                        placeholder='Select Country'
                        icon= {<Ionicons style={styles.mIcon} name='md-pin' size={20} />} 
                        component= {PickerComponent} 
                        items= {this.state.countries} 
                        type= 'input' 
                    />
                    <Text>Assign to Club</Text>
                    <Field 
                        name= 'club'
                        component= {SingleSelectComponent}
                        uniqueKey='id'
                        items= {this.state.clubs}
                        type= 'input' 
                    />
                    <Text>Assign to Team</Text>
                    <Field 
                        name= 'teams'
                        component= {MultiselectComponent}
                        uniqueKey='id'
                        items= {filteredTeam}
                        type= 'input'
                        hideSelect={!!selectedClub}
                    />
                    <View style={styles.footerButtons}>
                        <Button rounded success style={styles.saveBtn} onPress={this._playerSignup} >
                            <Text style={styles.saveText}>Save</Text>
                        </Button>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params?.player?'Edit Player':'Register New Player',
        headerRight: <MaterialCommunityIcons name="check" size={24} style={styles.checkIcon} onPress={() => navigation.state.params.playerSignup()} />
    });
}

const mapStateToProps = (state, props) => ({
    initialValues: camelToSnakeCaseKeys(props.navigation.state.params?.player),
    formData: state.form.registerPlayer
})

const enhance = compose(
    connect(mapStateToProps)
);

export default enhance(reduxForm({
    form: 'registerPlayer',
    validate
})(RegisterNewPlayerScreen));
