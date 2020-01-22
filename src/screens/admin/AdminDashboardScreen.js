import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import ScrollableHeader from '../../components/ScrollableHeader';
import { Card, } from 'native-base';
import ActionButton from 'react-native-action-button';
import Api from '../../services/api';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window');
const noItems = Math.floor((width-60)/(90+10));

const styles = {
    heading: {
        color: colors.colorPrimary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    wrapper: {
        padding: 30,
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
        height: 40,
        width: 40,
        resizeMode: 'contain'
    },
    detail: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    issues: {
        marginTop: 20
    },
    issuesCard: {
        marginBottom: 6,
        marginTop: 6,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
    },
    issuesText: {
        fontSize: 14,
        color: '#7d7d7d',
        marginLeft: 10
    },
    more: {
        color: '#b5b5b5',
        alignItems: 'flex-end'
    },
    actionButton: {
        zIndex: 1,
        flex: 1,
        position:'absolute',
        top: -12,
        right: -7,
        minHeight: height
    },
    actionButtonIcon: {
        fontSize: 18,
        color: '#fff'
    },
    viewMore: {
        display: 'flex', 
        alignItems: 'flex-end'
    },
    alertIcon: {
        color: '#d14545', 
        fontSize: 32
    },
    plusIcon: { 
        color: 'white', 
        fontSize: 24 
    },
    homeIcon: { 
        color: colors.colorAccent, 
        fontSize: 24 
    },
    list: {
        alignItems: 'center',
        justifyContent: 'center',
    }
}

class AdminDashboardScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clubs: [],
            issues: []
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.loadClubs();
        this.loadIssues();
    }

    async loadClubs() {
        try{
            let res = await Api.club.list();
            this.setState({ clubs: res.results });
        }
        catch(err){
            console.log(err);
        }
    }
    async loadIssues() {
        try{
            let res = await Api.issue.list();
            this.setState({ issues: res.results });
        }
        catch(err){
            console.log(err);
        }
    }

    _renderItem = ({ item }) => {
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
                        <Text style={styles.teamInfo}>{item.teamCount} teams</Text>
                    </View>
                        
                </Card>
            </TouchableOpacity>
        );
    }

    render() {
        const { navigation, user } = this.props;
        const {clubs,issues} = this.state;
        const content = (
            <View style={styles.wrapper}>
                <NavigationEvents
                    onDidFocus={this.loadData}
                />
                <View style={styles.header}>
                    <Text style={styles.heading}>Clubs</Text>
                </View>
                <FlatList
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollBar={false}
                    contentContainerStyle={styles.list}
                    data={clubs.slice(0,6)}
                    renderItem={this._renderItem} 
                    numColumns= {noItems}
                    horizontal={false}
                />
                {
                    this.props.user.isStaff &&
                        <ActionButton style={styles.actionButton}
                            buttonColor={colors.colorAccent}
                            renderIcon={() => <MaterialCommunityIcons name='plus' style={styles.plusIcon} />}
                            size={32}
                            offsetY={30}
                            offsetX={30}
                            verticalOrientation="down"
                            elevation={2}
                            bgColor="rgba(245, 245, 245, .92)">
                            <ActionButton.Item buttonColor='#9c3c96' title="Add Club" onPress={() => navigation.navigate('AddClub')}>
                                <Ionicons style={styles.actionButtonIcon} name='ios-add-circle-outline' />
                            </ActionButton.Item>
                            <ActionButton.Item buttonColor='#d14545' title="Manage Clubs" onPress={() => navigation.navigate('ClubManage',{clubs})}>
                                <Ionicons style={styles.actionButtonIcon} name='ios-settings' />
                            </ActionButton.Item>
                        </ActionButton>
                }
                <View style={styles.viewMore}>
                    <Text style={styles.more} onPress={() => navigation.navigate('Clubs')}>more +</Text>
                </View>
                <View style={styles.issues}>
                    <Text style={styles.heading}>Issues</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Support')} >
                        <Card style={styles.issuesCard}>
                            <MaterialCommunityIcons name="alert-circle" style={styles.alertIcon} />
                            <Text style={styles.issuesText}>{issues.length} Issues need attention</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        );
        return (
            <ScrollableHeader navigation={navigation} data={{image: user.image}} content={content} type='drawer' />
        );
    }

    static navigationOptions = () => ({
        title: 'Home',
        header: null,
        drawerIcon: () => (<MaterialCommunityIcons name='home' style={styles.homeIcon} />)
    });

}

const mapStateToProps = (state) => ({
    user: state.auth.user
});


export default connect(mapStateToProps)(AdminDashboardScreen);
