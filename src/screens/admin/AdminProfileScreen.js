import React, { Component } from 'react';
import { View, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles';
import {Button, Text} from 'native-base';
import moment from 'moment';
import { connect } from 'react-redux';

const styles = {
   
    wrapper: {
        paddingTop: 30,
        alignSelf: 'center',
    },
    image: {
        height:120,
        width: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 20
    },
    li: {
        display: 'flex',
        flexDirection: 'row',
        padding: 5
    },
    text: {
        color: '#8d8d8d',
        fontSize: 14,
    },
    button: {
        color: 'red',
        backgroundColor: colors.colorAccent,
        elevation: 6,
        marginTop: 20,
        alignSelf: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    designation: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#7d7d7d',
        marginBottom: 20,
    },
    icons: { 
        color: colors.colorAccent, 
        fontSize: 24, 
        marginRight: 10 
    },
    infoText: { 
        color: '#fff' 
    },
    accountIcon: { 
        color: colors.colorAccent, 
        fontSize: 24 
    }
}

class AdminProfileScreen extends Component {
    handleEditInfo = () => {
        this.props.navigation.navigate('AdminRegister', { coach: this.props.user });
    }

    render() {
        const { user } = this.props;
        const imageSource = user.image ? { uri: user.image } : require('../../assets/images/person.png');
        return (
            <View style={styles.wrapper}>
                <Image source={imageSource} style={styles.image} />
                <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                <Text style={styles.designation}>Admin</Text>
                <View style={styles.li}>
                    <MaterialCommunityIcons name='calendar' style={styles.icons} /> 
                    <Text style={styles.text}> Expires in {moment(user.expirationDate).format('MM-DD-YYYY')}  {/* TODO Count number od days */}</Text>
                </View>
                <View style={styles.li}>
                    <MaterialCommunityIcons name='map-marker' style={styles.icons} /> 
                    <Text style={styles.text}> From {user.streetAddress}, {user.country} {/* TODO Country Id instead of Name */}</Text> 
                </View>
                <View style={styles.li}>
                    <MaterialCommunityIcons name='cellphone' style={styles.icons} /> 
                    <Text style={styles.text}> {user.mobileNumber} </Text>
                </View>
                <View style={styles.li}>
                    <MaterialCommunityIcons name='email' style={styles.icons} /> 
                    <Text style={styles.text}> {user.email} </Text>
                </View>
                <Button  rounded style={styles.button} onPress={this.handleEditInfo}>
                    <Text style={styles.infoText}>Edit Info</Text>
                </Button>
            </View>
        );
        
    }

    static navigationOptions = () => ({
        title: 'Profile',
        headerRight: null,
        drawerIcon: () => (<MaterialCommunityIcons name='account' style={styles.accountIcon} />)
    });

}

const mapStateToProps = ({auth}) => ({
    user: auth.user
})

export default connect(mapStateToProps, null)(AdminProfileScreen);
