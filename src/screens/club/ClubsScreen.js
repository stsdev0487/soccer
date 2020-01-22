import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../../styles';
import { Card, } from 'native-base';
import ActionButton from 'react-native-action-button';
import Api from '../../services/api';
import { NavigationEvents } from 'react-navigation';

const {height, width} = Dimensions.get('window');
const noItems = Math.floor((width-60)/(90+10));

const styles = {
    wrapper: {
        padding: 30,
        minHeight: height
    },
    heading: {
        color: colors.colorPrimary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    subHeading: {
        color: '#4d4f50',
        fontWeight: 'bold',
        fontSize: 16
    },
    singleTeam: {
        marginBottom: 40,
    },
    team: {
        marginBottom: 6,
        marginTop: 6,
        minHeight: 54,
        marginRight: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
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
        height: 50,
        width: 50,
        resizeMode: 'contain'
    },
    header: {
        marginTop: 20,
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    verified: {
        color: colors.colorPrimaryGreen,
        fontSize: 14,
        marginLeft: 10
    },
    nameWrapper: {
        flexDirection: 'row',
    },
    actionButton: {
        zIndex: 1,
        flex: 1,
        position:'absolute',
        top: -12,
        right: -7,
    },
    actionButtonIcon: {
        fontSize: 18,
        color: '#fff'
    },
    icon: { 
        color: 'white', 
        fontSize: 24 
    },
    searchIcon: {
        paddingRight: 30
    },
    headerIcon: { 
        color: colors.colorAccent, 
        fontSize: 24 
    },
    list: {
        alignItems: 'center',
        justifyContent: 'center',
    }
}


export default class ClubsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clubs: [],
        };
        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        try {
            let res = await Api.club.list();
            this.setState({ clubs: res.results });
        } catch(err) {
            console.log(err);
        }
    }

    _renderItem = ({ item, }) => {
        const { navigation } = this.props;
        const imageSource = item.emblem ? { uri: item.emblem } : require('../../assets/images/club.png');
        return (
            <TouchableOpacity onPress={() => navigation.navigate('ClubDetail', {club: item})} >
                <Card style={styles.team}>
                    <Image source={imageSource} style={styles.image} />
                    <View style={styles.detail}>
                        <Text style={styles.teamName}>
                            {item.name}
                        </Text>
                        <Text style={styles.teamInfo}>{item.teamCount} Teams</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    render() {
        const { navigation } = this.props;
        const { clubs } = this.state;
        return (
            <ScrollView>
                <View style={styles.wrapper}>
                    <NavigationEvents
                        onDidFocus={this.loadData}
                    />
                    <Text style={styles.heading}>Clubs</Text>
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        data={clubs}
                        renderItem={this._renderItem} 
                        numColumns= {noItems}
                        horizontal={false}
                        contentContainerStyle={styles.list}
                    />
                    <ActionButton style={styles.actionButton}
                        buttonColor={colors.colorAccent}
                        renderIcon={() => <MaterialCommunityIcons name='plus' style={styles.icon} />}
                        size={32}
                        offsetY={30}
                        offsetX={30}
                        verticalOrientation="down"
                        elevation={2}
                        bgColor="rgba(245, 245, 245, .92)">
                        <ActionButton.Item buttonColor='#9c3c96' title="Add Club" onPress={() => navigation.navigate('AddClub')}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-add-circle-outline' />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#d14545' title="Manage Clubs" onPress={() => navigation.navigate('ClubManage',{clubs} )}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-settings' />
                        </ActionButton.Item>
                    </ActionButton>
                </View>
            </ScrollView >
        );
    }

    static navigationOptions = ({navigation}) => ({
        title: 'Clubs',
        headerRight: <Ionicons name='md-search' style={[styles.icon, styles.searchIcon ]} />,
        drawerIcon: () => (<Entypo name='sports-club' style={styles.headerIcon} />)
    });

}
