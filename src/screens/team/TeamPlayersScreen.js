import React, { Component } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { colors } from '../../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PlayerItem from '../../components/PlayerItem';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Api from '../../services/api';

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
    header: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    mainWrapper: {
        position: 'relative',
        minHeight: height
    },  
    addButton: {
        position: 'absolute',
        top: 30,
        right: 20
    },
    iconText: {
        color: '#8d8d8d',
        fontSize: 14,
    },
    icons: { 
        color: colors.colorAccent, 
        fontSize: 24, 
        marginRight: 10
    },
    actionButton: {
        zIndex: 1,
        flex: 1,
        position:'absolute',
        top: -12,
        right: -7,
    },
    icon: { 
        color: 'white', 
        fontSize: 24 
    },
    actionButtonIcon: {
        fontSize: 18,
        color: '#fff'
    },
    singleRoster: {
        marginBottom: 20
    },
    noPlayers: {
        color: '#7d7d7d',
        fontSize: 14,
    }
});

export default class TeamPlayerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rosters: [],
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const { currentTeam } = this.props.navigation.state.params;
            let res = await Api.roster.list({query: { team: currentTeam.id }});
            this.setState({ rosters: res.results });
        }
        catch (err) {
            console.log(err);
        }
    }

    _onReloadRoster = (refresh) => {
        if (refresh) {
            this.loadData();
        }
    }

    _renderItem = ({ item }) => {
        const { navigation } = this.props;
        return(
            < PlayerItem navigation={navigation} item={item} />
        ) 
    }

    _renderRosters() {
        const { rosters } = this.state;
        return rosters.map((item) => {
            return (
                <View style={styles.singleRoster}>
                    <Text style={styles.heading}>{item.title}</Text>
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
    
    render() {//TODO show players by roster group using roster api team filter
        const { players, currentTeam } = this.props.navigation.state.params;
        const { navigation } = this.props;
        return (
            <ScrollView style={styles.mainWrapper}>
                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <Text style={styles.headingText}>{currentTeam.name}</Text>
                    </View>
                    <ActionButton style={styles.actionButton}
                        buttonColor={colors.colorAccent}
                        renderIcon={() => <MaterialCommunityIcons name='plus' style={styles.icon} />}
                        size={32}
                        offsetY={30}
                        offsetX={30}
                        verticalOrientation="down"
                        elevation={2}
                        bgColor="rgba(245, 245, 245, .92)">
                        <ActionButton.Item buttonColor='#9c3c96' title="Add Roster" onPress={() => navigation.navigate('AddRoster', {currentTeam, onReloadRoster:this._onReloadRoster})}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-add-circle-outline' />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#d14545' title="Manage Players" onPress={() => navigation.navigate('ManageRoster',{players, currentTeam, onReloadRoster:this._onReloadRoster})}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-settings' />
                        </ActionButton.Item>
                    </ActionButton>
                    {
                        this._renderRosters()
                    }
                </View>
            </ScrollView>
        );
    }

    static navigationOptions = () => ({
        title: 'Team Roster',
        
    });
}
