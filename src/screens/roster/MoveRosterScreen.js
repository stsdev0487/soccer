import React, { Component } from 'react';
import { View, Text, Dimensions, Image, FlatList, StyleSheet } from 'react-native';
import { Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles';
import Api from '../../services/api';
import moment from 'moment';


const {height}= Dimensions.get('window');
const styles = StyleSheet.create({
    wrapper: {
        padding: 30,
        flex: 1,
        marginBottom: 20
    },
    heading: {
        color: colors.colorPrimary,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    headingText: {
        color: '#7d7d7d',
        fontSize: 18,
        fontWeight: 'bold'
    },
    player: {
        marginBottom: 6,
        marginTop: 6,
        minHeight: 54,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    detail: {
        display: 'flex',
        flex: 1
    },
    nameWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    playerName: {
        color: colors.colorPrimaryGrey,
        fontSize: 12,
        fontWeight: 'bold',
    
    },
    playerId: {
        color: '#8d8d8d',
        fontSize: 10,
        fontWeight: 'bold',
    },
    playerInfo: {
        color: colors.colorSecondaryGrey,
        fontSize: 10,
    },
    image: {
        marginRight: 10,
        height: 45,
        width: 45,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
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
    headerRight: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerIcon: {
        color: 'white',
        fontSize: 24,
        paddingRight: 16
    },
    noPlayers: {
        color: '#7d7d7d',
        fontSize: 14,
    }
});

export default class MoveRosterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rosters: [],
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
        this.props.navigation.setParams({
            onConfirm: this._onConfirm,
        });
    }

    async loadData() {
        try{
            let res = await Api.roster.list({ query: { id: this.props.navigation.state.params.nextRoster.id}}); //TODO list player a/c roster id api
            this.setState({ rosters: res.results });
        }
        catch(err){
            console.log(err);
        }
    }

    _onConfirm = async () => {
        const { nextRoster, selectedPlayers, currentTeam, onReloadRoster } = this.props.navigation.state.params;
        Api.movePlayersToRoster(selectedPlayers, nextRoster.id, currentTeam.id).then((res) => {
            onReloadRoster(true);
            this.props.navigation.pop(3);
        }).catch(err=>{
            console.log(err);
        });
    }
    _renderItem = ({ item }) => {
        const imageSource = item.image ? { uri: item.image } : require('../../assets/images/club.png');
        return (
            <View>
                <Card style={styles.player}>
                    <Image source={imageSource} style={styles.image} />
                    <View style={styles.detail}>
                        <View style={styles.nameWrapper}>
                            <Text style={styles.playerName}>
                                {item.firstName} {item.lastName}
                            </Text>
                            {item.verified &&
                                <Ionicons name='ios-checkmark-circle' style={styles.verified} />
                            }
                            <Text style={styles.playerId}> ID: {item.id} </Text>
                        </View>
                        {/* <Text style={styles.playerInfo}>
                            Teams: {item.teams.map((team, index) => {
                                return (`${team.name} ${index < item.teams.length - 1 ? ', ' : ''}`)
                            })}
                        </Text> */}
                        <Text style={styles.playerInfo}>Age: {moment().diff(item.dob, 'years', false)} years</Text>
                    </View>
                </Card>
            </View>
        );
    }

    _renderRosters() {
        const { rosters } = this.state;
        return rosters.map((item) => {
            return (
                <View style={styles.singleRoster}>
                    { item.players.length == 0 ? (
                        <Text style={styles.noPlayers}>No Players</Text>
                        ) : (
                        <FlatList
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollBar={false}
                            style={styles.list}
                            data={item.players}
                            extraData={this.state}
                            renderItem={this._renderItem}
                        />
                    )
                    }
                </View>
            );
        });
    }

    
    render() {
        const { players } = this.state;
        const {nextRoster} = this.props.navigation.state.params;
        return (
            <View style={styles.mainWrapper}>
                <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Text style={styles.headingText}>{nextRoster.title}</Text>
                </View>
                <Text style={styles.heading}>Players</Text>
                {
                    this._renderRosters()
                }
                    {/* <FlatList
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        style={styles.list}
                        data={players}
                        extraData={this.state}
                        renderItem={this._renderItem}
                    /> */}
                </View>
            </View>
        );
        
    }

    static navigationOptions = ({ navigation }) => ({
        title: null,
        headerRight: 
        <View style={styles.headerRight}>
            <MaterialCommunityIcons name='close' style={styles.headerIcon}  onPress={() => navigation.goBack()}/>
            <MaterialCommunityIcons name='check' style={styles.headerIcon}  onPress={()=>navigation.state.params.onConfirm()}/>
        </View> 
    });
}
