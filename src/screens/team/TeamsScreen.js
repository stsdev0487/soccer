import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { Card } from 'native-base';
import ActionButton from 'react-native-action-button';
import Api from '../../services/api';
import { NavigationEvents } from 'react-navigation';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    heading: {
        color: colors.colorPrimary,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10
    },
    subHeading: {
        color: '#4d4f50',
        fontWeight: 'bold',
        fontSize: 16
    },
    wrapper: {
        padding: 30,
        minHeight: height
    },
    singleTeam: {
        marginBottom: 40
    },
    teams: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 10
    },
    teamName: {
        color: colors.colorPrimaryGrey,
        fontSize: 12,
        fontWeight: 'bold',
    },
    teamInfo: {
        color: '#f1b86d',
        fontSize: 10,
    },
    image: {
        marginBottom: 10,
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    actionButton: {
        zIndex: 1,
        flex: 1,
        position: 'absolute',
        top: -12,
        right: -7
    },
    actionButtonIcon: {
        fontSize: 18,
        color: '#fff'
    },
    plusIcon: {
        color: 'white',
        fontSize: 24
    },
    headerIcon: { 
        color: colors.colorAccent, 
        fontSize: 24 
    }
});

export default class AdminTeamScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            clubs: []
        };
        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        try {
            let teamRes = await Api.team.list();
            let clubRes = await Api.club.list();
            this.setState({ teams: teamRes.results, clubs: clubRes.results });    
        } catch (err) {
            console.log(err);
        }
    }

    _renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const imageSource = item.emblem ? { uri: item.emblem } : require('../../assets/images/club.png');
        return (
            <TouchableOpacity onPress={() => navigate('TeamDetail', { team: item })}  >
                <Card style={styles.team}>
                    <Image source={imageSource} style={styles.image} />
                    <View style={styles.detail}>
                        <Text style={styles.teamName}>
                            {item.name}
                        </Text>
                        <Text style={styles.teamInfo}>{item.playerCount} players</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }


    render() {
        const { navigation } = this.props;
        const { teams, clubs} = this.state;
        return (
            <ScrollView style={styles.container}>
                <NavigationEvents
                    onDidFocus={this.loadData}
                />
                <View style={styles.wrapper}>
                    <Text style={styles.heading}>Team</Text>
                    {
                        clubs.map(club=> {
                            return (
                                <View style={styles.singleTeam} key={club.id}>
                                    <Text style={styles.subHeading}>Club: {club.name}</Text>
                                    <View style={styles.teams}>
                                        {club.teamCount?
                                            <FlatList
                                                keyExtractor={item => item.id.toString()}
                                                showsVerticalScrollBar={false}
                                                style={styles.list}
                                                data={teams.filter(team => team.club.id === club.id)}
                                                renderItem={this._renderItem}
                                                horizontal={true}
                                            />
                                            :
                                            <Text>No teams</Text>
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                    <ActionButton style={styles.actionButton}
                        buttonColor={colors.colorAccent}
                        renderIcon={() => <MaterialCommunityIcons name='plus' style={styles.plusIcon} />}
                        size={32}
                        offsetY={30}
                        offsetX={30}
                        verticalOrientation="down"
                        elevation={2}
                        bgColor="rgba(245, 245, 245, .92)">
                        <ActionButton.Item buttonColor='#9c3c96' title="Add Team" onPress={() => navigation.navigate('AddNewTeam')}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-add-circle-outline' />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#d14545' title="Manage Teams" onPress={() => navigation.navigate('TeamManage', { teams })}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-settings' />
                        </ActionButton.Item>
                    </ActionButton>
                </View>
            </ScrollView>

        );

    }

    static navigationOptions = () => ({
        title: 'Teams',
        headerRight: <Ionicons name='md-search' style={styles.headerIcon} />,
        drawerIcon: () => (<Ionicons name='md-people' style={styles.headerIcon} />)
    });

}
