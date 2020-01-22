import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../styles';
import { Card,} from 'native-base';
import ActionButton from 'react-native-action-button';
import Api from '../../services/api';
import { NavigationEvents } from 'react-navigation';

const {height, width} = Dimensions.get('window');
const noItems = Math.floor((width-60)/(90+10));

const styles = StyleSheet.create({
    
    heading: {
        color: colors.colorPrimary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    wrapper: {
        padding:30,
        minHeight: height
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
        textAlign: 'center'
    },
    teamInfo: {
        color: '#f1b86d',
        fontSize: 10,
        textAlign: 'center'
    },
    image: {
        marginBottom: 10,
        height: 50,
        width: 50,
        borderRadius:25,
        resizeMode: 'contain'
    },
    actionButton: {
        zIndex: 1,
        flex: 1,
        position:'absolute',
        top: -12,
        right: -7
    },
    actionButtonIcon: {
        fontSize: 18,
        color: '#fff'
    },
    icon: { 
        color: 'white', 
        fontSize: 24 
    },
    headerpadding: {
        paddingRight: 30 
    },
    drawerIconStyle: { 
        color: colors.colorAccent, 
        fontSize: 24 
    },
    list: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default class CoachScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coaches: [],
        };
        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        try{
            let res = await Api.user.list({ query: {profile__is_coach: true}});
            let newResults = res.results.map(result=>{
                result.teams = result.teams.map(team=>{
                    if ( typeof team !== 'object' ){team = JSON.parse(team)}; 
                    return team;
                });
                return result;
            });
            this.setState({ coaches: newResults });
        }
        catch(err){
            console.log(err);
        }
    }

    _renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const imageSource = item.image ? { uri: item.image } : require('../../assets/images/club.png');
        return (
            <TouchableOpacity onPress={() => navigate('CoachProfile',{coach: item})} >
                <Card style={styles.team}>
                    <Image source={imageSource} style={styles.image} />
                    <View style={styles.detail}>
                        <Text style={styles.teamName}>
                            {item.firstName} {item.lastName}
                        </Text>
                        <Text style={styles.teamInfo}>Manages {item.teams.length} teams</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    render() {
        const { navigation } = this.props;
        const { coaches } = this.state;
        // this.setState({  })
        return (
            <ScrollView>
                <View style={styles.wrapper}>
                    <NavigationEvents
                        onDidFocus={this.loadData}
                    />
                    <Text style={styles.heading}>Coaches</Text>
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        numColumns={noItems}
                        data={coaches}
                        renderItem={this._renderItem}
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
                        <ActionButton.Item buttonColor='#9c3c96' title="Add Coach" onPress={() => navigation.navigate('AdminRegister')}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-add-circle-outline' />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#d14545' title="Manage Coaches" onPress={() => navigation.navigate('CoachManage',{coaches})}>
                            <Ionicons style={styles.actionButtonIcon} name='ios-settings' />
                        </ActionButton.Item>
                    </ActionButton>
                </View>
            </ScrollView >
        );

    }

    static navigationOptions = () => ({
        title: 'Coaches',
        headerRight: <Ionicons name='md-search' style={[ styles.icon,styles.headerpadding]} />,

        drawerIcon: () => (<FontAwesome5 name='user-tie' style={styles.drawerIconStyle} />)
    });

}
