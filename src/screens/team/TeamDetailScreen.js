import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Tab, Tabs, Container, Button, Card, } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import ScrollableHeader from '../../components/ScrollableHeader';
import ActionButton from 'react-native-action-button';
import { NavigationEvents } from 'react-navigation';
import Api from '../../services/api';
import ImagePicker from 'react-native-image-crop-picker';
import MultiUpload from '../../components/MultiUpload';
import PlayerItem from '../../components/PlayerItem';

const { width} = Dimensions.get('window');
const noItems = Math.floor((width-60)/(90+(8+8)));

const styles = StyleSheet.create({
    tabContent: {
       backgroundColor: '#f5f5f5',
       paddingTop: 20,
       minHeight: 1200,
       display: 'flex',
       flex: 1
    },
    overviewText: {
       textAlign: 'center',
        paddingLeft: 50, 
        paddingRight: 50,
        lineHeight: 18,
        color: '#7d7d7d',
        fontSize: 12
    },
    coaches: {
        marginTop: 10,
        paddingLeft: 50, 
        paddingRight: 50,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    coachesText: {
       color: '#7d7d7d',
       fontSize: 14,
       fontWeight: 'bold'
    },
    coachesName: {
       color: '#f1b86d',
       fontSize: 14,
       fontWeight: 'bold'
    },
    maxPlayerText: {
       textAlign: 'center',
       marginTop: 10,
       color: '#7d7d7d',
       fontSize: 14,
       fontWeight: 'bold',
    },
    editButton: {
        color: 'red',
        backgroundColor: '#f1b86d',
        elevation: 6,
        marginBottom: 20,
        marginTop: 20,
        alignSelf: 'center',
        width: '40%'
    },
    editText: {
        color: 'white',
        fontWeight: 'bold'
    },
    showAllButton: {
        color: 'red',
        backgroundColor: '#f1b86d',
        elevation: 6,
        marginBottom: 20,
        marginTop: 20,
        alignSelf: 'center',
        width: '60%',
        alignItems: 'center'
        },
    showAllText: {
        color: 'white',
        fontWeight: 'bold',
    },
    total: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 110,
        paddingRight: 110
    },
    number: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8d8d8d'
    },
    labels: {
        fontSize: 12,
        color: '#8d8d8d'
    },
    line: {
        width: 2,
        height: 35,
        backgroundColor: '#d1d1d1'
    },
    totalContent: {
        alignItems: 'center'
    },
    photoSection: {
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 50,
    },
    photoWrapper: {
        marginBottom: 10,
        paddingRight: 8,
        paddingLeft: 8
    },
    photoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignSelf: 'stretch',
    },
    photosText:{
        color: '#1b75bc',
        fontSize: 16
    },
    wrapper: {
        paddingLeft: 30,
        paddingRight: 30,
        flex: 1,
    },
    heading: {
        color: '#1b75bc',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10
    },
    subHeading: {
        textAlign: 'center',
        fontSize: 14,
        color: '#7d7d7d',
        fontWeight: 'bold'
    },
    actionButton: {
        zIndex: 1,
        flex: 1,
        position:'absolute',
        top: 50,
        right: -7
    },
    actionButtonIcon: {
        fontSize: 18,
        color: '#fff'
    },
    detailContainer: {
        marginTop: -20
    },
    touchableCard: {
        flex:1.1, 
        marginLeft: 10
    },
    tabBarStyle: {
        borderBottomWidth: 2,
        borderBottomColor: '#f1b86d'
    },
    tabElevation: {
        elevation: 0
    },
    tabBackground: {
        backgroundColor: '#fff'
    },
    activeTabText: {
        color: '#f1b86d',
        fontWeight: 'normal'
    },
    plusIcon: {
        color: 'white',
        fontSize: 24
    },
    tabText: {
        color: '#7d7d7d'
    },
    galleryImage: {
        width:90,
        height: 90
    }
    
});

export default class TeamScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            isUploading: false,
            teamImages: [],
            coaches: null
        };
        this.loadData = this.loadData.bind(this);
    }

    handleEditInfo = () => {
        this.props.navigation.navigate('AddNewTeam', {team: this.props.navigation.state.params.team});
    }

    async loadData() {
        try{
            let coachesList = this.props.navigation.state.params.team.coach;
            let res = await Api.player.list({ query: { teams: this.props.navigation.state.params.team.id }});
            let newResults = res.results.map(result=>{
                result.teams = result.teams.map(team=>{
                    if ( typeof team !== 'object' ){team = JSON.parse(team)}; 
                    return team;
                });
                return result;
            });
            let coaches = [];
            const coachPromise = coachesList.map(async(coach)=> {
                let coachRes = await Api.user.list({ query: { username: coach }});
                coaches.push(coachRes.results[0]);
            });
            await Promise.all(coachPromise);
            
            this.setState({ players: newResults, coaches  });
        }
        catch(err){
            console.log(err);
        }
    }

    _uploadTeamImages() {
        ImagePicker.openPicker({
            multiple: true,
            width: 300,
            height: 400,
            cropping: false
        }).then(images => {
            const { team } = this.props.navigation.state.params;
            let teamImages = images.map(image=>({
                title: image.filename,
                image: {uri: image.sourceURL, type: image.mime, name: image.filename},
                team: team.id,
                path: image.path
            }));
            this.setState({
                teamImages,
                isUploading: true
            });
        });
    }
    
    _onUploadComplete = () => {
        this.setState({isUploading: false});
    }

    _onReloadTeam = (refresh) => {
        if (refresh) {
            this.loadData();
        }
    }

    _renderItem = ({ item }) => {
        const { navigation } = this.props;
        return <PlayerItem navigation={navigation} item={item} />;
    }

    _renderGallery = ({ item }) => {
        return (
            <View style={styles.photoWrapper}>
                <Image style={styles.galleryImage} source={{ uri: item }} />
            </View>
        );
    }

    render() {
        const {navigation} = this.props;
        const { players, isUploading, teamImages, coaches } = this.state;
        const { team } = this.props.navigation.state.params;
        let topPlayers = players.slice(0,3);
        let unverifiedPlayers = players.filter( 
            player => player.status == 'unverified' || player.status == 'pending'
        );


        const content = (
            <Container style={styles.detailContainer}>
                <NavigationEvents
                    onDidFocus={this.loadData}
                />
                <Tabs tabBarUnderlineStyle={styles.tabBarStyle} tabBarBackgroundColor={'#333'} tabContainerStyle={styles.tabElevation}>
                    <Tab heading="Overview" tabStyle={styles.tabBackground} textStyle={styles.tabText}  activeTabStyle={styles.tabBackground} activeTextStyle={styles.activeTabText} >
                        <ScrollView style={styles.tabContent}>
                            <Text style={styles.overviewText}> {team.description} </Text>
                            <View style={styles.coaches}>
                                <View>
                                    <Text style={styles.coachesText}>Coaches : </Text>
                                </View>
                                <View>
                                    {coaches && coaches.map(coach=> (
                                        <Text style={styles.coachesName} key={coach.id}>
                                            {coach.firstName} {coach.lastName}({coach.username})
                                        </Text>
                                    ))} 
                                </View>
                            </View>
                            <Text style={styles.maxPlayerText}>Max No. of Players: {team.maxPlayers} </Text>
                            
                            <View style={styles.total}>
                                <View style={styles.totalContent}>
                                    <Text style={styles.number}>{team.playerCount}</Text>
                                    <Text style={styles.labels}>Players</Text>
                                </View>
                                <View style={styles.line}></View>
                                <View style={styles.totalContent}>
                                    <Text style={styles.number}>{coaches && coaches.length}</Text>
                                    <Text style={styles.labels}>Coaches</Text>
                                </View>
                            </View>
                            <Button full rounded style={styles.editButton} onPress={this.handleEditInfo}>
                                <Text style={styles.editText}>Edit Info</Text>
                            </Button>
                            <View style={styles.photoSection}>
                                <View style={styles.photoHeader}>
                                    <Text style={styles.photosText}>Photos</Text>
                                    <TouchableOpacity onPress={this._uploadTeamImages.bind(this)}>
                                        <Text style={styles.addPhoto}>+ Add Photos</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    keyExtractor={item => item}
                                    showsVerticalScrollBar={false}
                                    data={team.gallery}
                                    renderItem={this._renderGallery} 
                                    numColumns= {noItems}
                                    horizontal={false}
                                />
                            </View>
                        </ScrollView>
                    </Tab>
                    <Tab heading="Players" tabStyle={styles.tabBackground} textStyle={styles.tabText}  activeTabStyle={styles.tabBackground} activeTextStyle={styles.activeTabText}>
                        <ScrollView style={styles.tabContent}>
                            <View style={styles.wrapper}>
                            <View style={styles.coaches}>
                                <View>
                                    <Text style={styles.coachesText}>Coaches : </Text>
                                </View>
                                <View>
                                    {coaches && coaches.map(coach=> (
                                        <Text style={styles.coachesName} key={coach.id}>
                                            {coach.firstName} {coach.lastName}({coach.username})
                                        </Text>
                                    ))}
                                </View>
                            </View>
                                <Button full rounded style={styles.editButton} onPress={() => navigation.navigate('VirtualPlayer',{ team,  players})} >
                                    <Text style={styles.editText}>Players Card</Text>
                                </Button>
                                <Text style={styles.heading}>Players</Text>
                                        
                                <FlatList
                                    keyExtractor={item => item.id.toString()}
                                    showsVerticalScrollBar={false}
                                    style={styles.list}
                                    data={topPlayers}
                                    extraData={this.state}
                                    renderItem={this._renderItem}
                                />
                                <Button full rounded style={styles.showAllButton} onPress={() => navigation.navigate('TeamPlayers',{players, currentTeam: team, })} >
                                    <MaterialCommunityIcons name='plus' style={styles.plusIcon} />
                                    <Text style={styles.showAllText}>Official Roster</Text>
                                </Button>
                                <Text style={styles.subHeading}>Following Players need verification</Text>
                                <FlatList
                                    keyExtractor={item => item.id.toString()}
                                    showsVerticalScrollBar={false}
                                    style={styles.list}
                                    data={unverifiedPlayers}
                                    extraData={this.state}
                                    renderItem={this._renderItem}
                                />
                                <ActionButton style={styles.actionButton}
                                    buttonColor={colors.colorAccent}
                                    renderIcon={() => <MaterialCommunityIcons name='plus' style={styles.plusIcon} />}
                                    size={32}
                                    offsetY={30}
                                    offsetX={30}
                                    verticalOrientation="down"
                                    elevation={2}
                                    bgColor="rgba(245, 245, 245, .92)">
                                    <ActionButton.Item buttonColor='#9c3c96' title="Add Player" onPress={() => navigation.navigate('RegisterNewPlayer')}>
                                        <Ionicons style={styles.actionButtonIcon} name='ios-add-circle-outline' />
                                    </ActionButton.Item>
                                    <ActionButton.Item buttonColor='#d14545' title="Manage Players" onPress={() => navigation.navigate('PlayerManage',{players, currentTeam: team, club: team.club})}>
                                        <Ionicons style={styles.actionButtonIcon} name='ios-settings' />
                                    </ActionButton.Item>
                                </ActionButton>
                            </View>
                        </ScrollView>
                    </Tab>
                </Tabs>
                {isUploading &&
                    <MultiUpload visible={isUploading} items={teamImages} apiKey='teamGalleries' onUploadComplete={this._onUploadComplete} />
                }
            </Container>
                 
            
        );
        return (
            <ScrollableHeader navigation={navigation} data={{name: team.name, image: team.emblem, nameTitle: 'Team' }} content={content} />
        );
    }

    static navigationOptions = () => ({
        title: 'Team',
        header: null
    });
}
