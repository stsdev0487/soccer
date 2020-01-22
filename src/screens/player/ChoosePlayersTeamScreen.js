import React, { Component } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Row } from 'native-base';
import { colors } from '../../styles';
import { connect } from 'react-redux';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    wrapper: {
        padding: 30,
        flex: 1,
        marginBottom: 75
    },
    heading: {
        color: colors.colorPrimary,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    headingTeam: {
        color: '#f1b86d',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    selected: {
        color: colors.colorPrimary,
        fontSize: 14,
        marginLeft: 10
    },
    list: {
        marginTop: 20
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
        height: 40,
        width: 40,
        borderRadius: 20
    },
    verified: {
        color: colors.colorPrimaryGreen,
        fontSize: 14,
        marginLeft: 10
    },

    checkboxFlex: {
        display: 'flex',
        flexDirection: 'row'
    },
    selectedFlex: {
        display: 'flex',
        flexDirection: 'row'
    },
    mainWrapper: {
        flex: 1
    },
    touchableCard: {
        flex: 1.1,
        marginLeft: 10
    },
    headerIcon: {
        color: '#fff',
        fontSize: 24,
        paddingLeft: 30
    },
    team: {
        marginBottom: 6,
        marginTop: 6,
        minHeight: 54,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        width: 95,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    teamName: {
        color: colors.colorPrimaryGrey,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    teamInfo: {
        color: '#f1b86d',
        fontSize: 10,
        textAlign: 'center'
    },
    image: {
        marginBottom: 10,
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    radioFlex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    active: {
        backgroundColor: 'red'
    },
    headerOkIcon: {
        color: 'white',
        fontSize: 24,
        paddingRight: 16
    },
    activeText: {
        color: 'white'
    }
});

class ChoosePlayersTeamScreen extends Component {
    constructor(props) {
        super(props);
        let selectedPlayersObj = props.navigation.state.params.selectedPlayersObj;
        let { user } = this.props;
        let filteredTeams = null;
        let fliteredTeamsId = null;
        if (!user.isStaff && user.isCoach){
            filteredTeams = user.teams.map(team=>JSON.parse(team));
            fliteredTeamsId = filteredTeams.map(filteredTeam=>filteredTeam.id);
        }
        this.state = {
            checked: [false],
            fliteredTeamsId: fliteredTeamsId,
            selectedPlayers: selectedPlayersObj.map((player)=>{
                let currentTeam = player.teams[0].id;
                if(fliteredTeamsId) {
                    for (var i = 0; i < player.teams.length; i++) {
                        if (fliteredTeamsId.includes(player.teams[i].id)) {
                            currentTeam = player.teams[i].id;
                            break;
                        }
                    }
                }
                return({player: player.id, current_team: currentTeam })
            }),
            selectOptions: selectedPlayersObj.map((player)=>{
                return player.teams.filter(team=>{
                    if(fliteredTeamsId) {
                        if(fliteredTeamsId.includes(team.id)) {
                            return true;
                        }
                        return false;
                    }
                    return true;
                })
                .map(team=>{
                    return({player: player.id, current_team: team.id });
                })
            })
        };
        this._onTeamSelect = this._onTeamSelect.bind(this);
    }

    
    componentDidMount() {
        this.props.navigation.setParams({
            onConfirm: this._onConfirm,
        });
    }

    _onConfirm = async () => {
        const { selectedPlayers } = this.state;
        const { club } = this.props.navigation.state.params;
        this.props.navigation.navigate('SelectTeam', {selectedPlayers, club});
    }

    
    _onTeamSelect(playerIndex, teamIndex) {
        let {selectedPlayers, selectOptions} = this.state;
        selectedPlayers[playerIndex] = selectOptions[playerIndex][teamIndex];
        this.setState({selectedPlayers});
    }

    _renderItem = (props) => {
        let { item, index } = props;
        const { navigate } = this.props.navigation;
        const imageSource = item.image ? { uri: item.image } : require('../../assets/images/club.png');
        const { selectedPlayers, selectOptions, filteredTeams } = this.state;
        let active = (selectedPlayers[item.playerIndex].current_team === selectOptions[item.playerIndex][index].current_team)? true:false;
        return (
            <View style={styles.radioFlex}>
                <TouchableOpacity
                    onPress={() => this._onTeamSelect(item.playerIndex, index)}
                    style={styles.touchableCard}
                >
                    <Card style={[styles.team, active?styles.active:'']}>
                        <Image source={imageSource} style={styles.image} />
                        <View style={styles.detail}>
                            <Text style={[styles.teamName, active?styles.activeText:'']}>
                                {item.name}
                            </Text>
                        </View>
                    </Card>
                </TouchableOpacity>
            </View>
        );
    }

    
    _renderTeam() {
        const { selectedPlayersObj } = this.props.navigation.state.params;
        const {fliteredTeamsId} = this.state;
        return selectedPlayersObj.map((player, pIndex) => {
            player.teams.map(team => {team.playerIndex = pIndex});
            let teams = player.teams.filter(team=>{
                if(fliteredTeamsId) {
                    if(fliteredTeamsId.includes(team.id)) {
                        return true;
                    }
                    return false;
                }
                return true;
            })
            .map(team=>{
                team.playerIndex = pIndex;
                return(team);
            })
            return (
                <View style={[styles.single, ]} key={player.id}>
                    <Text style={styles.heading}>{player.firstName} {player.lastName}</Text>
                    <FlatList
                        keyExtractor={player => player.id.toString()}
                        showsVerticalScrollBar={false}
                        style={styles.list}
                        data={teams}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        horizontal={true}
                    />
                </View>
            );
        });
    }


    render() {
        const { navigation } = this.props;
        const { selectedPlayersObj, club } = this.props.navigation.state.params;
        let currentTeam = this.props.navigation.state.params.currentTeam || null;
        const { selectedPlayers, selectOptions } = this.state;
        return (
            <View style={styles.mainWrapper}>
                <ScrollView style={styles.wrapper}>
                    <Text>Warning: You are moving players who may be present in multiple team. Please select the team (highlighted by red) that a particular player should be moved from.</Text>
                    {club &&
                        <Text style={styles.headingTeam}>{club.name}</Text>
                    }
                    <View>
                    </View>
                    {
                        this._renderTeam()
                    }
                </ScrollView>
            </View>
        );
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Choose Players Team ',
        headerLeft: <MaterialCommunityIcons
            name='close'
            onPress={() => navigation.goBack()}
            style={styles.headerIcon} />,
        headerRight: <MaterialCommunityIcons name='check' style={styles.headerOkIcon}  onPress={()=>navigation.state.params.onConfirm()}/>,
    });
}

const mapStateToProps = (state) => ({
    user: state.auth.user
})

export default connect(mapStateToProps, null)(ChoosePlayersTeamScreen);