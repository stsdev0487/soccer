import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Item, Label } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import Api from '../../services/api';

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
    wrapper: {
        padding: 30,
        flex: 1,
        marginBottom: 20
    },
    list: {
        marginTop: 20,
    },
    player: {
        marginBottom: 15,
        // minHeight: 54,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    teamName: {
        color: colors.colorPrimaryGrey,
        fontSize: 14,
        fontWeight: 'bold',
    },
    image: {
        marginRight: 20,
        height: 45,
        width: 45,
        resizeMode: 'contain'
    },
    mainWrapper: {
        position: 'relative',
        minHeight: height
    },
    input: {
        flex: 1,
        paddingLeft: 60,
        color: colors.colorSecondaryGrey,
        fontSize: 14
    },
    formSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#bebcbc',
        paddingLeft: 10
    },
    searchIcon: {
        color: '#b5b5b5',
        fontSize: 24
    },
    transparentBorder: {
        color: '#b5b5b5',
        fontSize: 24
    },
    searchLabel: {
        color: '#b5b5b5',
        paddingLeft: 10,
        marginTop: -15
    },
    headerIcon: {
        color: '#fff',
        fontSize: 24,
        paddingLeft: 30
    }
});

export default class SelectClubScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clubs: [],
            players: []
        };
        this.loadData = this.loadData.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            let res = await Api.club.list();
            this.setState({ clubs: res.results });
        }
        catch (err) {
            console.log(err);
        }
    }

    _loadPlayer = async ( item ) => {
        Api.player.list({query: { club: item.id }}).then((res) => {
            let newResults = res.results.map(result=>{
                result.teams = result.teams.map(team=>{
                    if ( typeof team !== 'object' ){team = JSON.parse(team)}
                    return team;
                });
                return result;
            });
            this.props.navigation.navigate('PlayerManage', {players: newResults, club: item });
        }).catch(err=>{
            console.log(err);
        });
    }
// call player api with query of selected club
    // after success  navigate('PlayerManage', { club: item })
    

    _renderItem = ({ item }) => {
        const imageSource = item.image ? { uri: item.image } : require('../../assets/images/club.png');
        return (
            <ScrollView>
                <TouchableOpacity
                    onPress={() => this._loadPlayer(item) }
                >
                    <View style={styles.player}>
                        <Image source={imageSource} style={styles.image} />
                        <Text style={styles.teamName}>
                            {item.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    render() {
        const { clubs } = this.state;
        return (
            <View style={styles.mainWrapper}>
                <View style={styles.wrapper}>
                    <View style={styles.formSection}>
                        <Ionicons name='md-search' style={styles.searchIcon} />
                        <Item style={styles.transparentBorder} floatingLabel>
                            <Label style={styles.searchLabel} >Select a Club</Label>
                            <TextInput inputFontSize={16} style={styles.input} underlineColorAndroid="#bebcbc" />
                        </Item>
                    </View>
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        style={styles.list}
                        data={clubs}
                        extraData={this.state}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        );
    }

    static navigationOptions = ({navigation}) => ({
        title: 'Select Club',
        headerRight: null,
        headerLeft: <MaterialCommunityIcons name='close' style={styles.headerIcon}  onPress={() => navigation.goBack()}/>,
    });
}
