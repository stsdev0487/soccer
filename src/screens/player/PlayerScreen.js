import React, { Component } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationEvents } from 'react-navigation';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import Api from '../../services/api';
import { colors } from '../../styles';
import PlayerItem from '../../components/PlayerItem';

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
    wrapper: {
        padding: 30,
        flex: 1,
        minHeight: height
    },
    list: {
        marginTop: 20,
    },
    mainWrapper: {
        position: 'relative',
        minHeight: height
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
    drawerIconStyle: { 
        color: colors.colorAccent, 
        fontSize: 24 
    }
});

export default class PlayerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
        };
        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        try{
            let res = await Api.player.list();
            let newResults = res.results.map(result=>{
                result.teams = result.teams.map(team=>{
                    if ( typeof team !== 'object' ){team = JSON.parse(team)}
                    return team;
                });
                return result;
            });
            this.setState({ players: newResults });
        }
        catch (err) {
            console.log(err);
        }
    }


    _renderItem = ({ item }) => {
        const { navigation } = this.props;
        return <PlayerItem navigation={navigation} item={item} />;
    }


    render() {
        const { navigation } = this.props;
        const { players } = this.state;
        return (
            <ScrollView>
                <View style={styles.mainWrapper}>
                <NavigationEvents
                    onDidFocus={this.loadData}
                />
                <View style={styles.wrapper}>
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        style={styles.list}
                        data={players}
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
                        <ActionButton.Item buttonColor='#d14545' title="Manage Players" onPress={() => navigation.navigate('SelectClub', { players })}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-settings' />
                        </ActionButton.Item>
                    </ActionButton>
                </View>

            </View>
            </ScrollView>
            
        );

    }

    static navigationOptions = () => ({
        title: 'Players',
        drawerIcon: () => (<MaterialCommunityIcons name='tshirt-crew' style={styles.drawerIconStyle} />)
    });
}
