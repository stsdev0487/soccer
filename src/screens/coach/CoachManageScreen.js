import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'native-base';
import { colors } from '../../styles';
import RoundCheckbox from 'rn-round-checkbox';
import ManageFooter from '../../components/ManageFooter';
import { Toast } from 'native-base';
import Api from '../../services/api';

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
        borderRadius: 25,
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
        position: 'relative',
    },
    touchableCard: {
        position: 'relative',
        zIndex: -20
    },
    headerIcon: {
        color: '#fff',
        fontSize: 24,
        paddingLeft: 30
    }
});

export default class CoachManageScreen extends Component {
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
        let count = this.state.count;
        count = checked[id] ? count + 1 : count - 1;
        this.setState({ checked: checked, count: count });
    }

    _deleteItems = async() => {
        const { checked } = this.state;
        const selectedCoaches = [];
        checked.map((chk, coachId) => {
            coachId !== 0 && chk && selectedCoaches.push(coachId);
            return;
        });
        if (selectedCoaches === undefined || selectedCoaches.length == 0) {
            Toast.show({ text: 'Please Select a Coach' });
        }
        else {
            const { navigate } = this.props.navigation;
            let res = await Api.bulkDeleteCoach(selectedCoaches);
            navigate('Coaches');
        }
    }
    
    _renderItem = ({ item }) => {
        const imageSource = item.image ? { uri: item.image } : require('../../assets/images/club.png');
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
                                    {item.firstName} {item.lastName}
                                </Text>
                                <Text style={styles.teamInfo}>Manages {item.teams.length} teams</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        const { coaches } = this.props.navigation.state.params;
        const { count } = this.state;
        return (
            <View style={styles.mainWrapper}>
                <View style={styles.wrapper}>
                    <View>
                        <Text style={styles.heading}>Coaches</Text>
                        <View style={styles.selectedFlex}>
                            <RoundCheckbox
                                size={20}
                                checked={this.state.checked[0]}
                                onValueChange={() => {
                                    let checked = this.state.checked;
                                    checked[0] = !checked[0];
                                    coaches.map(coach => checked[coach.id] = checked[0]);
                                    this.setState({ checked, count: checked[0] ? coaches.length : 0 });
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
                        data={coaches}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        numColumns={3}
                    />
                </View>
                <ManageFooter navigation={navigation} deleteItems={this._deleteItems}/>
            </View>
        );
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Manage Coaches',
        headerLeft: <MaterialCommunityIcons
            name='close'
            onPress={()=>navigation.goBack()}
            style={styles.headerIcon}
        />,
        headerRight: null,
    });
}
