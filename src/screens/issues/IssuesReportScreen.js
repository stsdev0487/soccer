import React, { Component } from 'react';
import { View, Image, TextInput, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { colors } from '../../styles';
import {Button, Text} from 'native-base';

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        padding: 30,
    },
    panel: {
        flex: 1,
        borderColor: '#cecece',
        borderWidth: 1,
        padding: 10,
        borderRadius: 4
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#cecece',
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    headerText: {
        fontSize: 12,
        color: '#8d8d8d',
    },
    reporterView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    imageCircular: {
        height: 34,
        width: 34,
        borderRadius: 17,
        marginRight: 20
    },
    reporterText: {
        fontSize: 12,
        color: '#7d7d7d',
        marginRight: 10,
    },
    titleText: {
        fontSize: 14,
        color: '#7d7d7d',
        fontWeight: 'bold',
        marginBottom: 20
    },
    description: {
        color: '#7d7d7d',
        fontSize: 12,
        lineHeight: 18
    },
    input: {
        color: colors.colorSecondaryGrey,
        fontSize: 14,
        borderBottomColor: '#dbdbdb',
        borderBottomWidth: 1,
        marginLeft: 10
    },
    assigned: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    resolveButton: {
        color: 'red',
        backgroundColor: colors.colorPrimary,
        elevation: 6,
    },
    resolveText: {
        color: 'white'
    },
    assignedTo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    assignedToText: {
        fontSize: 16,
        color: '#7d7d7d',
    },
    drawerIconStyle: { 
        color: colors.colorAccent, 
        fontSize: 24 
    }
    
});

export default class IssuesReportScreen extends Component {

    constructor(props){
        super(props)
        
    }

    render() {
        const { id,title,description,createdAt,resolved,createdBy,issuedTo } = this.props.navigation.state.params;
        const imageSource =  require('../../assets/images/club.png');
        return (
            <View style={styles.wrapper}>
                <View style={styles.panel}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>#{id}</Text>
                        <Text style={styles.headerText}>{moment(createdAt).format('YYYY/MM/DD hh:mm')}</Text>
                    </View>
                    <View style={styles.reporterView}>
                        <Image source={imageSource} style={styles.imageCircular} />
                        <Text style={styles.reporterText}>Reported By: {createdBy}</Text>
                    </View>
                    
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <View style={styles.assigned}>
                        <View style={styles.assignedTo}>
                            <Text style={styles.assignedToText}>Assigned To:</Text>
                            <TextInput inputFontSize={16} style={styles.input} underlineColorAndroid="transparent" placeholder="John Doe"/>
                        </View>
                        
                        <Button full rounded style={styles.resolveButton}>
                            <Text style={styles.resolveText}>Resolve</Text>
                        </Button>
                    </View>
                </View>
            </View>
        );
        
    }

    static navigationOptions = () => ({
        title: 'Issues',
        headerRight: null,
        drawerIcon: () => (<MaterialCommunityIcons name='account' style={styles.drawerIconStyle} />)
    });

}
