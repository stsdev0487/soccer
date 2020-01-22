import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { reduxForm, Field } from 'redux-form';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colors } from '../../styles';
import InputComponent from '../../components/InputComponent';
import TextareaComponent from '../../components/TextareaComponent';
import SingleSelectComponent from '../../components/SingleSelectComponent';
import { camelToSnakeCaseKeys } from '../../utils/text';
import Api from '../../services/api';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    checkIcon: {
        color: 'white',
        paddingRight: 16
    },
    teamEmblem: {
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
    editImageText: {
        color: '#1b75bc',
        fontSize: 12
    },
    icon: {
        color: colors.colorAccent,
        marginTop: 10,
        marginLeft: 20,
    },
    wrapper: {
        padding: 30,
    },
    uploadView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40
    },
    uploadText: {
        color: '#1b75bc',
        fontSize: 14
    },
    uploadIcon: {
        marginLeft: 140,
        color: colors.colorAccent,
    }
});

const validate = values => {
    const error = {};
    error.name = '';
    error.description = '';
    error.max_players = '';
    
    var nm = values.name;
    var des = values.description;
    var mp = values.max_players;
    
    if(!mp){
        error.id = 'Required';
    } else if(isNaN(Number(mp))) {
        error.id = 'Enter a Number'
    }

    if (!nm) {
        error.name = 'Required';
    } else if (nm.length > 18) {
        error.name = 'max 18 characters';
    }
    if (!des) {
        error.description = 'Required';
    }

    return error;
};

class AddNewTeamScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            clubs:[],
            isReady: true,
            loading: false,
            progress: 0
        };
        this.loadClub = this.loadClub.bind(this);
        this._uploadEmblem = this._uploadEmblem.bind(this);
        
        this.addTeamFields = [
            { name: 'name', placeholder: 'Team Name', icon: <Ionicons style={styles.icon} name='md-people' size={20} />, component: InputComponent, type: 'input', },
            { name: 'max_players', placeholder: 'Number of Players', icon: <Ionicons style={styles.icon} name='md-people' size={20} />, component: InputComponent, type: 'input', },
            { name: 'description', placeholder: 'Team Description', icon: <Ionicons style={styles.icon} name='md-list-box' size={20} />, component: TextareaComponent, type: 'input', },
        ]

    }

    componentDidMount() {
        this.props.navigation.setParams({
            teamSignup: this._teamSignup,
        });
        this.loadClub();
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

    _onProgress = (progress)=> {
        this.setState({progress});
    }

    _teamSignup = async () => {
        this.setState({ loading: true });
        const { emblem } = this.state;
        const { navigation } = this.props;
        let formValues = this.props.formData.values;
        delete formValues.emblem;
        Object.keys(formValues).forEach(k => (!formValues[k] && formValues[k] !== undefined) && delete formValues[k]);
        if(emblem){
            formValues.emblem={uri: emblem.path, type: emblem.mime, name: emblem.path.split('/').pop()}; //TODO use timestamp and club with extension from path
        }
        Api.team.createOrUpdate(formValues, { 
            onProgress: this._onProgress
        }).then(() => {
            navigation.navigate('Teams');
        }).catch(()=>{
            this.setState({progress: 0});
        });
    }

    _uploadFile() {
        DocumentPicker.show(
            {
                filetype: [DocumentPickerUtil.allFiles()],
            },
            (error, res) => {
                this.setState({ 
                    fileUri: res.uri,
                    fileType: res.type,
                    fileName: res.fileName,
                    fileSize: res.fileSize,
                });
            }
        );
    }


    _uploadEmblem() {
        const options = {
            width: 300,
            height: 400,
            cropping: false
        };
        ImagePicker.openPicker(options).then(image => {
            this.setState({
                emblem: image
            });
        });
    }


    render() {
        const { emblem } = this.state;
        let team = this.props.navigation.state.params?.team;
        let teamEmblem = null;
        if (team) {
            teamEmblem = team.emblem;
        }
        let emblemSource;
        if (emblem && emblem.path) {
            emblemSource = { uri: emblem.path };
        } else {
            emblemSource = teamEmblem?  { uri: teamEmblem }: require('../../assets/images/club.png');
        }
        return (
            <KeyboardAwareScrollView style={styles.container}>
                <Image style={styles.teamEmblem} source={emblemSource} />
                <TouchableOpacity style={styles.editImageBtn} onPress={this._uploadEmblem.bind(this)}>
                    <Text style={styles.editImageText}> Add Team Emblem </Text>
                </TouchableOpacity>
                <View style={styles.wrapper}>
                    {this.addTeamFields.map((addTeamField) => {
                        if (addTeamField.type === 'input') {
                            return (
                                <Field key={addTeamField.name}{...addTeamField} />
                            );
                        }
                        else if (addTeamField.type === 'upload') {
                            return (
                                <View key={addTeamField.name} style={styles.uploadView}>
                                    <Text style={styles.uploadText}>Upload Team Images</Text>
                                    <Ionicons style={styles.uploadIcon} name='md-cloud-upload' size={32}
                                        onPress={this._uploadFile.bind(this)} />
                                </View>
                            );
                        }
                    })}
                    <Text>Assign to Club</Text>
                    <Field 
                        name= 'club'
                        component= {SingleSelectComponent}
                        uniqueKey='name'
                        items= {this.state.clubs}
                        type= 'input' 
                    />
                </View>
            </KeyboardAwareScrollView>
        );
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params?.team?'Edit Team':'Add New Team',
        headerRight: <MaterialCommunityIcons name="check" size={24} style={styles.checkIcon} onPress={()=>navigation.state.params.teamSignup()} />
    });
}

const mapStateToProps = (state, props) => ({
    initialValues: camelToSnakeCaseKeys(props.navigation.state.params?.team),
    formData: state.form.addTeam
})

const enhance = compose(
    connect(mapStateToProps)
);
export default enhance(reduxForm({
    form: 'addTeam',
    validate
})(AddNewTeamScreen));
