import React, { Component } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Toast, Card } from 'native-base';
import { colors } from '../../styles';
import RoundCheckbox from 'rn-round-checkbox';
import ManageFooter from '../../components/ManageFooter';
import Api from '../../services/api';

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
    selected: {
        color: colors.colorPrimary,
        fontSize: 14,
        marginLeft: 10
    },
    list: {
        marginTop: 20,
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
    checkboxFlex: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
    },
    checkBox: {
        position: 'absolute',
        marginLeft: 10,
        marginTop: 10
    },
    selectedFlex: {
        display: 'flex',
        flexDirection: 'row'
    },
    mainWrapper: {
        flex: 1,
    },
    closeButton: {
        color: '#fff',
        fontSize: 24,
        paddingLeft: 30
    },
    touchableCard: {
        position: 'relative',
        zIndex: -20
    },
});

export default class TeamManageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: [false],
            count: 0
        };
        this._onValueChange = this._onValueChange.bind(this);
    }

    _onValueChange(id) {
        let checked = this.state.checked;
        if (checked[0]) checked[0] = false;
        checked[id] = !checked[id];
        this.setState({ checked: checked })
        let count = this.state.count;
        count = checked[id] ? count + 1 : count - 1;
        this.setState({ count: count });
    }

    _deleteItems = async () => {
        const { checked } = this.state;
        const selectedTeams = [];
        checked.map((chk, teamId) => {
            teamId !== 0 && chk && selectedTeams.push(teamId);
            return;
        });
        if (selectedTeams === undefined || selectedTeams.length == 0) {
            Toast.show({ text: 'Please Select a Team' });
        }
        else {
            const { navigate } = this.props.navigation;
            let res = await Api.bulkDeleteTeam(selectedTeams);
            navigate('Teams');
        }
    }

    _renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const imageSource = item.emblem ? { uri: item.emblem } : require('../../assets/images/club.png');
        return (
            <View>
                <View style={styles.checkboxFlex}>
                    <View style={styles.checkBox}>
                        <RoundCheckbox
                            size={20}
                            checked={this.state.checked[item.id]}
                            onValueChange={() => this._onValueChange(item.id)}
                            borderColor='#b5b5b5'
                            backgroundColor='#f1b86d'
                        />
                    </View>

                    <TouchableOpacity onPress={() => this._onValueChange(item.id)} style={styles.touchableCard}  >
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
                </View>
            </View>
        );
    }


    render() {
        const { navigation } = this.props;
        const { teams } = this.props.navigation.state.params;
        const { count } = this.state;
        return (
            <View style={styles.mainWrapper}>
                <View style={styles.wrapper}>
                    <View>
                        <Text style={styles.heading}>Teams</Text>
                        <View style={styles.selectedFlex}>
                            <RoundCheckbox
                                size={20}
                                checked={this.state.checked[0]}
                                onValueChange={() => {
                                    let checked = this.state.checked;
                                    checked[0] = !checked[0];
                                    teams.map(team => checked[team.id] = checked[0]);
                                    this.setState({ checked, count: checked[0] ? teams.length : 0 });
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
                        data={teams}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        numColumns={3}
                    />
                </View>
                <ManageFooter deleteItems={this._deleteItems} />
            </View>
        );
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Manage Teams',
        headerLeft: <MaterialCommunityIcons
            name='close'
            onPress={() => navigation.goBack()}
            style={styles.closeButton} />,
        headerRight: null,
    });
}
