import React, { Component } from 'react';
import { View, Image, StyleSheet,ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {Button, Text} from 'native-base';
import { colors } from '../../styles';
import Api from '../../services/api';
import { Toast } from 'native-base';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { generateBase64Image, getPdfHeader } from '../../utils/pdf';
import RNPrint from 'react-native-print';
import RNFetchBlob from "react-native-fetch-blob";
const fs = RNFetchBlob.fs;

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
    pdfText: {
        color: '#8d8d8d',
        fontSize: 14,
    },
    button: {
        color: 'red',
        backgroundColor: colors.colorAccent,
        elevation: 6,
        alignSelf: 'center'
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    designation: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#7d7d7d'
    },
    id: {
        fontSize: 14,
        alignSelf: 'center',
        marginBottom: 20,
        color: '#8d8d8d'
    },
    pdfPrint: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        top: 30,
        zIndex: 1,
    },
    icons: { 
        color: colors.colorAccent, 
        fontSize: 24, 
        marginRight: 10
    },
    infoText: { 
        color: '#fff' 
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    verifyBtn: {
        backgroundColor: colors.colorPrimary,
        elevation: 6,
        marginLeft: 11,
    },
    download: {
        position: 'absolute',
        right: 20,
        top: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default class PlayerProfileScreen extends Component {
    state = {
        loading: false
    }

    _generateHTML = async() => {
        const { player } = this.props.navigation.state.params;
        let html = await getPdfHeader();
        html+='<div style="display: flex; flex-direction: column; justify-content: center; align-items: center">';
        html+=`<img src="${await generateBase64Image(player.image?player.image:'https://i.imgur.com/RHojise.png')}" style="width:120px ; height: 120px; border-radius: 50%; margin-bottom: 20px; object-fit: cover">`;
        html+=`<h2 style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 10px;">Name: ${player.firstName} ${player.lastName}</h2>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Gender: ${player.gender}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Club: ${player.club.name}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Teams: ${player.teams.map((team, index) => {
            return (`${team.name} ${index < player.teams.length - 1 ? ', ' : ''}`)
        })}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Player ID: ${player.id}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Position: ${player.position}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Jersey: ${player.jerseyNumber}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px"> Date of birth: ${moment(player.dob).format('MM-DD-YYYY')}</h5>`
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Expires: ${moment(player.expirationDate).format('MM-DD-YYYY')}</h5>`
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Address: ${player.streetAddress}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">State ZipCode: ${player.stateZipcode}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Contact: ${player.mobile}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Email: ${player.email}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Parent: ${player.parentName}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Verification Status: ${player.status}</h5>`;
        html+=`<h5 style="font-size: 12px; margin-top: 0; margin-bottom: 5px">Verification Message: ${player.verificationMessage}</h5>`;
        html+='</div>';
        return html;
    }

    _createPDF = async() => {
        const { player } = this.props.navigation.state.params;
        this.setState({loading: true});
        let options = {
            html: await this._generateHTML(),
            fileName: player.name,
            directory: 'Documents',
        };
        let pdf = await RNHTMLtoPDF.convert(options);
        this.setState({loading: false});
        return pdf.filePath;

    }

    _printPDF = async () => {
        let filePath = await this._createPDF();
        await RNPrint.print({ filePath });
        fs.unlink(filePath);
    }

    handleEditInfo = () => {
        const { player } = this.props.navigation.state.params;
        this.props.navigation.navigate('RegisterNewPlayer', {
            player
        })
    }

    _sendVerification = async() => {
        const {player} = this.props.navigation.state.params;
        await Api.sendVerification([player.id]);
        Toast.show({ text: 'Player requested for verification.' });
    }
    render() {
        const { loading } = this.state;
        if(loading) {
            return (
                <View style={[styles.container]}>
                    <Text>Generating PDF...</Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        const { navigation } = this.props;
        const {player} = navigation.state.params;
        const imageSource = player.image ? { uri: player.image } : require('../../assets/images/person.png');
        return (
            <ScrollView>
                <View style={styles.pdfPrint}>
                    <TouchableOpacity onPress={() => this._createPDF()}>
                        <MaterialCommunityIcons name='file-pdf' style={styles.icons}/>
                        <Text style={styles.pdfText}>PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this._printPDF()}>
                        <MaterialCommunityIcons name='printer' style={styles.icons} />
                        <Text style={styles.pdfText}>Print</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.wrapper}>
                    <Image source={imageSource} style={styles.image} />
                    <Text style={styles.name}>{player.firstName} {player.lastName}</Text>
                    <Text style={styles.designation}>{player.position}</Text>
                    <Text style={styles.designation}>{player.jerseyNumber}</Text>
                    <Text style={styles.designation}>Teams: {
                        player.teams.map((team, index) => {
                            return (`${team.name} ${index < player.teams.length - 1 ? ', ' : ''}`)
                        })
                    }</Text>
                    <Text style={styles.id}>ID: {player.code}</Text>
                    <View style={styles.li}>
                        <MaterialCommunityIcons name='calendar' style={styles.icons} /> 
                        <Text style={styles.text}>Born on {moment(player.dob).format('MM-DD-YYYY')}</Text>
                    </View>
                    <View style={styles.li}>
                        <MaterialCommunityIcons name='calendar' style={styles.icons} /> 
                        <Text style={styles.text}>Expires in {moment(player.expirationDate).format('MM-DD-YYYY')}</Text>
                    </View>
                    <View style={styles.li}>
                        <MaterialCommunityIcons name='map-marker' style={styles.icons} /> 
                        <Text style={styles.text}>{player.streetAddress}</Text>
                    </View>
                    <View style={styles.li}>
                        <MaterialCommunityIcons name='map-marker-radius' style={styles.icons} /> 
                        <Text style={styles.text}>State ZipCode: {player.stateZipcode}</Text>
                    </View>
                    <View style={styles.li}>
                        <MaterialCommunityIcons name='cellphone' style={styles.icons} /> 
                        <Text style={styles.text}>{player.mobile}</Text>
                    </View>
                    <View style={styles.li}>
                        <MaterialCommunityIcons name='email' style={styles.icons} /> 
                        <Text style={styles.text}> {player.email}</Text>
                    </View>
                    <View style={styles.li}>
                        <MaterialCommunityIcons name='human-male' style={styles.icons} /> 
                        <Text style={styles.text}>Parent: {player.parentName}</Text>
                    </View>
                    {/* <View style={styles.li}>
                        <MaterialCommunityIcons name='human-female' style={styles.icons} /> 
                        <Text style={styles.text}>Mother: {player.motherName}</Text>
                    </View> */}
                    <View style={styles.li}>
                        <MaterialCommunityIcons name='verified' style={styles.icons} /> 
                        <Text style={styles.text}>Verification Status: {player.status}</Text>
                    </View>
                    {
                        !!player.verificationMessage &&
                            <View style={styles.li}>
                                <Text style={styles.text}>Message: {player.verificationMessage}</Text>
                            </View>
                    }
                    
                    <View style={styles.footerButtons}>
                        <Button rounded style={styles.button} onPress={this.handleEditInfo}>
                            <Text style={styles.infoText}>Edit Info</Text>
                        </Button>
                        {
                            player.status == 'unverified' && player.certificateFile &&
                                <Button rounded style={styles.verifyBtn} onPress={()=>this._sendVerification()}>
                                    <Text style={styles.saveText}>Send for Verification</Text>
                                </Button>
                        }
                    </View>
                </View>
            </ScrollView>
           
        );
        
    }

    static navigationOptions = () => ({
        title: 'Profile',
        headerRight: null,
    });

}
