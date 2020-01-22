import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { reduxForm, Field } from 'redux-form';
import { Button, } from 'native-base';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import InputComponent from '../../components/InputComponent';
import Api from '../../services/api';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icon: {
        color: colors.colorAccent,
        marginTop: 10,
        marginLeft: 20,
    },
    wrapper: {
        padding: 30,
    },
    saveBtn: {
        elevation: 6,
        marginBottom: 20,
        paddingHorizontal: 21,
        marginTop: 28,
        alignSelf: 'stretch',
        color: '#1b75bc',
        backgroundColor: '#1b75bc',
        justifyContent: 'center'
    },
    saveText: {
        color: 'white',
        
    },
});

class SubmitIssueScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: true,
            loading: false
        };
        this.addClubFields = [
            { name: 'title', placeholder: 'Issue', icon: <MaterialCommunityIcons style={styles.icon} name='message-alert' size={20} />, component: InputComponent, },
            { name: 'description', placeholder: 'Description', icon: <Ionicons style={styles.icon} name='md-list-box' size={20} />, component: InputComponent, },
        ]

    }

    _onSubmit = async () => {
        this.setState({ loading: true });
        const { formData, navigation } = this.props;
        const issue = formData.values;
        try {
            let response = await Api.issue.create(issue);
            navigation.navigate('Support');
        } catch (err) {
            console.log(err);
        }
    }


    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.wrapper}>
                    {this.addClubFields.map((addClubField, key) => {
                        return (
                            <Field {...addClubField} />
                        );
                    })}
                    <Button rounded style={styles.saveBtn} onPress={this._onSubmit} >
                        <Text style={styles.saveText}>Save</Text>
                    </Button>
                </View>
            </ScrollView>
        );
    }

    static navigationOptions = () => ({
        title: 'Submit Issue',
        headerRight: null
    });

}

const mapStateToProps = (state) => ({
    formData: state.form.issues
})

const enhance = compose(
    connect(mapStateToProps)
);

export default enhance(reduxForm({
    form: 'issues',
    //validate
})(SubmitIssueScreen));
