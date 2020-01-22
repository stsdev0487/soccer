import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { reduxForm, Field } from 'redux-form';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import InputComponent from '../../components/InputComponent';
import TextareaComponent from '../../components/TextareaComponent';
import Api from '../../services/api';
import { camelToSnakeCaseKeys } from '../../utils/text';

const styles=StyleSheet.create({
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
    
    var nm = values.name;
    var des = values.description;

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

class AddClubScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: true,
            loading: false,
            progress: 0
        };
        this._uploadEmblem = this._uploadEmblem.bind(this);
        this.addClubFields = [
            { name: 'name', placeholder: 'Club Name', icon: <Ionicons style={styles.icon} name='md-people' size={20} />, component: InputComponent, type: 'input', },
            { name: 'description', placeholder: 'Club Description', icon: <Ionicons style={styles.icon} name='md-list-box' size={20} />,  component: TextareaComponent, type: 'input', },
        ]
    }

    componentDidMount() {
        this.props.navigation.setParams({
            clubSignup: this._clubSignup,
        });
    }

    _onProgress = (progress)=> {
        this.setState({progress});
    }
    
    _clubSignup = async () => {
        this.setState({ loading: true });
        const { emblem } = this.state;
        let { navigation } = this.props;
        let formValues = this.props.formData.values;
        delete formValues.emblem;
        Object.keys(formValues).forEach(k => (!formValues[k] && formValues[k] !== undefined) && delete formValues[k]);
        if(emblem){
            formValues.emblem={uri: emblem.path, type: emblem.mime, name: emblem.path.split('/').pop()}; //TODO use timestamp and club with extension from path
        }
        Api.club.createOrUpdate(formValues, { 
            onProgress: this._onProgress 
        }).then(() => {
            navigation.navigate('Clubs');
        }).catch(err=>{
            console.log(err);
            this.setState({progress: 0});
        });
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
        let club = this.props.navigation.state.params?.club;
        let clubEmblem = null;
        if (club) {
            clubEmblem = club.emblem;
        }
        let emblemSource;
        if (emblem && emblem.path) {
            emblemSource = { uri: emblem.path };
        } else {
            emblemSource = clubEmblem?  { uri: clubEmblem }: require('../../assets/images/club.png');
        }
        return(
            <ScrollView style={styles.container}>
                <Image style={styles.teamEmblem} source={emblemSource} />
                <TouchableOpacity style={styles.editImageBtn} onPress={this._uploadEmblem.bind(this)}>
                    <Text style={styles.editImageText}> Add Club Emblem </Text>
                </TouchableOpacity>
                <View style={styles.wrapper}>
                    {this.addClubFields.map(addClubField => {
                        if (addClubField.type === 'input') {
                            return (
                                <Field key={addClubField.name} {...addClubField} />
                            );
                        }
                        else if (addClubField.type === 'upload') {
                            return (
                                <View key={addClubField.name} style={styles.uploadView}>
                                    <Text style={styles.uploadText}>Upload Club Images</Text>
                                    <Ionicons style={styles.uploadIcon} name='md-cloud-upload' size={32}
                                        onPress={this._uploadClubImages.bind(this)} />
                                </View>
                            );
                        }
                    })}
                    </View>
            </ScrollView>
        );
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params?.club?'Edit Club':'Add New Club',
        headerRight: <MaterialCommunityIcons name="check" size={24} style={styles.checkIcon} onPress={()=>navigation.state.params.clubSignup()} />
    });

}
 
const mapStateToProps = (state, props) => ({
    initialValues: camelToSnakeCaseKeys(props.navigation.state.params?.club),
    formData: state.form.addClubs,
    validate
})

const enhance = compose(
    connect(mapStateToProps)
);

export default enhance(reduxForm({
    form: 'addClubs',
    validate
})(AddClubScreen));
