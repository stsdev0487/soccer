import React, { Component } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import RoundCheckbox from 'rn-round-checkbox';
import moment from 'moment';
import ManageFooter from '../../components/ManageFooter';
import { Toast } from 'native-base';
import Api from '../../services/api';
import TeamScreen from '../team/TeamDetailScreen';

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
});

export default class ManageRosterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            checked: [false],
            count: 0
        };
        this.loadData = this.loadData.bind(this);
        this._onValueChange = this._onValueChange.bind(this);
        this._addPlayer = this._addPlayer.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        let { checked } = this.state;
        this.props.navigation.state.params.players.map(player => checked[player.id] = false);
        this.setState({
            checked: checked,
        });
    }

    _addPlayer = () => {
        const { checked } = this.state;
        let { currentTeam, onReloadRoster } = this.props.navigation.state.params;
        const selectedPlayers = [];
        checked.forEach((chk, playerId) => {
            playerId !== 0 && chk && selectedPlayers.push(playerId);
        });
        if (selectedPlayers === undefined || selectedPlayers.length == 0) {
            Toast.show({ text: 'Please Select a Player' });
        }
        else {
            const { navigate } = this.props.navigation;
            navigate('SelectRoster', { selectedPlayers, currentTeam, onReloadRoster });
        }
    }

    _deleteItems = async() => {
        const { checked } = this.state;
        const selectedPlayers = [];
        checked.map((chk, playerId) => {
            playerId !== 0 && chk && selectedPlayers.push(playerId);
            return;
        });
        if (selectedPlayers === undefined || selectedPlayers.length == 0) {
            Toast.show({ text: 'Please Select a Coach' });
        }
        else {
            const { navigate } = this.props.navigation;
            await Api.bulkDeletePlayer(selectedPlayers);
            navigate('Players');
        }
    }

    _onValueChange(id) {
        let checked = this.state.checked;
        if (checked[0]) checked[0] = false;
        checked[id] = !checked[id];
        this.setState({ checked })
        let count = this.state.count;
        count = checked[id] ? count + 1 : count - 1;
        this.setState({ count: count });
    }

    _renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const imageSource = item.image ? { uri: item.image } : require('../../assets/images/club.png');
        return (
            <View>
                <View style={styles.checkboxFlex}>
                    <RoundCheckbox
                        size={20}
                        checked={this.state.checked[item.id]}
                        onValueChange={() => this._onValueChange(item.id)}
                        borderColor='#b5b5b5'
                        backgroundColor='#f1b86d'
                    />
                    <TouchableOpacity
                        onPress={() => this._onValueChange(item.id)}
                        style={styles.touchableCard}
                    >
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
                                <Text style={styles.playerInfo}>
                                    Teams: {item.teams.map((team, index) => {
                                        return (`${team.name} ${index < item.teams.length - 1 ? ', ' : ''}`)
                                    })}
                                </Text>
                                <Text style={styles.playerInfo}>Age: {moment().diff(item.dob, 'years', false)} years</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    render() {
        const { navigation } = this.props;
        const { players, addDisabled } = this.props.navigation.state.params;
        let currentTeam = this.props.navigation.state.params.currentTeam || null;
        const { count } = this.state;
        console.log(players);
        return (
            <ScrollView style={styles.mainWrapper}>
                <ScrollView style={styles.wrapper}>
                    {currentTeam &&
                        <Text style={styles.headingTeam}>{currentTeam.name}</Text>
                    }
                    <View>
                        <Text style={styles.heading}>Players</Text>
                        <View style={styles.selectedFlex}>
                            <RoundCheckbox
                                size={20}
                                checked={this.state.checked[0]}
                                onValueChange={() => {
                                    let checked = this.state.checked;
                                    checked[0] = !checked[0];
                                    players.map(player => checked[player.id] = checked[0]);
                                    this.setState({ checked, count: checked[0] ? players.length : 0 });
                                }}
                                borderColor='#b5b5b5'
                                backgroundColor='#f1b86d'
                            />
                            <Text style={styles.selected}>{count}(selected) </Text>
                        </View>
                        <Text> All </Text>
                    </View>
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        style={styles.list}
                        data={players}
                        extraData={this.state}
                        renderItem={this._renderItem}
                    />
                </ScrollView>
                <ManageFooter navigation={navigation} addPlayer={!addDisabled?this._addPlayer:null} deleteItems={this._deleteItems}/>
            </ScrollView>
        );
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Manage Players',
        headerLeft: <MaterialCommunityIcons
            name='close'
            onPress={() => navigation.goBack()}
            style={styles.headerIcon} />,
        headerRight: null,
    });
}
