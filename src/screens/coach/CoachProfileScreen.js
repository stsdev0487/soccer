import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles';
import { Button, Text } from 'native-base';
import moment from 'moment';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
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
        width: '30%',
        alignSelf: 'center'
    },
    backgroundImage: {
        alignSelf: 'center',
        marginBottom: 20
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
    icon: { 
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
    

});

class CoachProfileScreen extends Component {

    handleEditInfo = (coach) => {
        this.props.navigation.navigate('AdminRegister', { coach });
    }

    _getCoachProfile = (coach) => {
        const imageSource = coach.image ? { uri: coach.image } : require('../../assets/images/person.png');
        return (
            <View style={styles.wrapper}>
                <Image source={imageSource} style={styles.image} />
                <Text style={styles.name}>{coach.firstName} {coach.lastName}</Text>
                <Text style={styles.designation}>Coach</Text>
                <Text style={styles.designation}>
                    Teams: {coach.teams.map((team, index) => {
                        return (`${team.name} ${index < coach.teams.length - 1 ? ', ' : ''}`)
                    })}
                </Text>
                <View style={styles.li}>
                    <MaterialCommunityIcons name='calendar' style={styles.icon} /> 
                    <Text style={styles.text}> Expires in {moment(coach.expirationDate).format('MM-DD-YYYY')} </Text>
                </View>
                <View style={styles.li}>
                    <MaterialCommunityIcons name='map-marker' style={styles.icon} /> 
                    <Text style={styles.text}> {coach.streetAddress} </Text>
                </View>
                <View style={styles.li}>
                    <MaterialCommunityIcons name='cellphone' style={styles.icon} /> 
                    <Text style={styles.text}> {coach.mobileNumber} </Text>
                </View>
                <View style={styles.li}>
                    <MaterialCommunityIcons name='email' style={styles.icon} /> 
                    <Text style={styles.text}> {coach.email} </Text>
                </View>
                <Button full rounded style={styles.button} onPress={()=>this.handleEditInfo(coach)}>
                    <Text style={styles.infoText}>Edit Info</Text>
                </Button>
            </View>
        );
    }

    render() {
        const {user} = this.props;
        let coach = this.props.navigation.state.params?.coach;
        
        return (
            this._getCoachProfile(coach?coach:user)
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

export default connect(mapStateToProps, null)(CoachProfileScreen);
