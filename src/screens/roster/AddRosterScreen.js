import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
    },
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

class AddRosterScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: true,
            loading: false,
            progress: 0
        };
        this.addRosterFields = [
            { name: 'title', placeholder: 'Roster Name', icon: <Ionicons style={styles.icon} name='md-people' size={20} />, component: InputComponent, type: 'input', },
        ]
    }

    componentDidMount() {
        this.props.navigation.setParams({
            createRoster: this._createRoster,
        });
    }
    
    _createRoster = async () => {
        this.setState({ loading: true });
        let { currentTeam, onReloadRoster} = this.props.navigation.state.params;
        let { navigation } = this.props;
        let formValues = this.props.formData.values;
        formValues.team = currentTeam.name;
        Object.keys(formValues).forEach(k => (!formValues[k] && formValues[k] !== undefined) && delete formValues[k]);
        Api.roster.createOrUpdate(formValues).then(() => {
            onReloadRoster(true);
            navigation.goBack();
        }).catch(err=>{
            console.log(err);
            this.setState({progress: 0});
        });
    }

    render() {
        return(
            <ScrollView style={styles.container}>
                <View style={styles.wrapper}>
                    {this.addRosterFields.map(addRosterField => {
                        return (
                            <Field key={addRosterField.name} {...addRosterField} />
                        );
                    })}
                    </View>
            </ScrollView>
        );
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params?.roster?'Edit Roster':'Add New Roster',
        headerRight: <MaterialCommunityIcons name="check" size={24} style={styles.checkIcon} onPress={()=>navigation.state.params.createRoster()} />
    });

}
 
const mapStateToProps = (state, props) => ({
    initialValues: camelToSnakeCaseKeys(props.navigation.state.params?.roster),
    formData: state.form.addRosters,
    validate
})

const enhance = compose(
    connect(mapStateToProps)
);

export default enhance(reduxForm({
    form: 'addRosters',
    validate
})(AddRosterScreen));
