import React, { Component } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import { Card } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { generateBase64Image, getPdfHeader } from '../../utils/pdf';
import RNPrint from 'react-native-print';
import RNFetchBlob from "react-native-fetch-blob";
const fs = RNFetchBlob.fs;
const {height}= Dimensions.get('window');

const styles = StyleSheet.create({
    wrapper: {
        padding: 30,
        flex: 1,
        marginBottom: 20
    },
    headingText: {
        color: '#7d7d7d',
        fontSize: 18,
        fontWeight: 'bold'
    },
    list: {
        marginTop: 20,
    },
    player: {
        marginBottom: 6,
        marginTop: 6,
        minHeight: 54,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#f1b86d'
    },
    detail: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between'
    },
    nameWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    playerName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    playerInfo: {
        color: '#fff',
        fontSize: 12,
    },
    image: {
        marginRight: 10,
        height: 80,
        width: 80,
    },
    verified: {
        color: colors.colorPrimaryGreen,
        fontSize: 14,
        marginLeft: 10
    },
    mainWrapper: {
        position: 'relative',
        minHeight: height
    }, 
    pdfPrint: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        top: 30,
        zIndex:1
    },
    pdfText: {
        color: '#8d8d8d',
        fontSize: 14,
    },
    icons: { 
        color: colors.colorAccent, 
        fontSize: 24, 
        marginRight: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default class VirtualPlayerScreen extends Component {
    state = {
        loading: false
    }
    

    _generateHTML = async() => {
        const { players, team } = this.props.navigation.state.params;
        let html = await getPdfHeader();
        html += `<h4>Club: ${team.club.name}</h4>`;
        html += `<h4>Team: ${team.name}</h4>`;
        html += '<div><h2 style="color: #7d7d7d; font-size: 18px; font-weight: bold">Players Cards</h2>';
        const playersPromise = players.map(async(player)=> {
            let playerHTML='';
            playerHTML+='<div style="margin-bottom: 6px; margin-top: 6px; padding: 10px; display: flex; flex-direction: row; background-color: #f1b86d">';
            playerHTML+=`<img src="${await generateBase64Image(player.image?player.image:'https://i.imgur.com/RHojise.png')}" style="margin-right: 10px; height: 90px; width: 90px; object-fit: cover;"/>`;
            playerHTML+='<div>';
            playerHTML+=`<h3 style="color: #fff; font-size: 14px; font-weight: bold; margin-top: 0; margin-bottom: 5px">${player.firstName} ${player.lastName}</h3>`;
            playerHTML+=`<h5 style="color: #fff; font-size: 12px; margin-top: 0; margin-bottom: 5px">Player ID: ${player.id}</h5>`;
            playerHTML+=`<h5 style="color: #fff; font-size: 12px; margin-top: 0; margin-bottom: 5px">${player.position}</h5>`;
            playerHTML+=`<h5 style="color: #fff; font-size: 12px; margin-top: 0; margin-bottom: 5px"> Date of birth: ${moment(player.dob).format('MM-DD-YYYY')}</h5>`
            playerHTML+=`<h5 style="color: #fff; font-size: 12px; margin-top: 0; margin-bottom: 5px">Expires: ${moment(player.expirationDate).format('MM-DD-YYYY')}</h5>`
            playerHTML+='</div>';
            playerHTML+='</div>';
            return playerHTML;
        });
        let playersHTML = await Promise.all(playersPromise);
        playersHTML.map(playerHTML=>{
            html+=playerHTML;
        });
        return html;
    }
    
    _printPDF = async () => {
        let filePath = await this._createPDF();
        await RNPrint.print({ filePath });
        fs.unlink(filePath);
    }

    _createPDF = async() => {
        const { team } = this.props.navigation.state.params;
        this.setState({loading: true});
        let options = {
            html: await this._generateHTML(),
            fileName: team.name,
            directory: 'Documents',
        };
        let pdf = await RNHTMLtoPDF.convert(options);
        this.setState({loading: false});
        return pdf.filePath;
    }

    _renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const imageSource = item.image ? { uri: item.image } : require('../../assets/images/person.png');
        return (
            <View>
                
                <TouchableOpacity onPress={() => navigate('PlayerProfile',{player: item})} >
                <Card style={styles.player}>
                        <Image source={imageSource} style={styles.image} />
                        <View style={styles.detail}>
                            <Text style={styles.playerName}>
                                {item.firstName} {item.lastName}
                            </Text>
                            <Text style={styles.playerInfo}>
                                Player ID: {item.id}
                            </Text>
                            <Text style={styles.playerInfo}>
                                {item.jerseyNumber}
                            </Text>
                            <Text style={styles.playerInfo}>
                                Date of birth: {moment(item.dob).format('MM-DD-YYYY')}
                            </Text>
                            <Text style={styles.playerInfo}>
                                Expires: {moment(item.expirationDate).format('MM-DD-YYYY')}
                            </Text>
                            
                        </View>
                    </Card>
                </TouchableOpacity>
            </View>
        );
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
        const { players } = this.props.navigation.state.params;
        return (
            <View style={styles.mainWrapper}>
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
                    <Text style={styles.headingText}>Players Cards</Text>
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        style={styles.list}
                        data={players}
                        extraData={this.state}
                        renderItem={this._renderItem}
                    />
                </View>
               
            </View>
        );
        
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.team.name,
    });
}
