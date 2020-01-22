import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'native-base';
import { colors } from '../../styles';
import RoundCheckbox from 'rn-round-checkbox';

const {height}= Dimensions.get('window');
const styles = StyleSheet.create({
    wrapper: {
        padding: 30,
        flex: 1,
        marginBottom:75,
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
    checkboxFlex: {
        display: 'flex',
        flexDirection: 'row'
    },
    selectedFlex: {
        display: 'flex',
        flexDirection: 'row'
    },
    mainWrapper: {
        position: 'relative',
        minHeight: height
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
        justifyContent: 'space-between'
    },
    pendingView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        justifyContent: 'space-between'
    },
    titleText: {
        fontSize: 14,
        color: '#4d4f50'
    },
    dateText: {
        fontSize: 10,
        color: '#8d8d8d',
    },
    statusResolved: {
        fontSize: 10,
        color: '#36b236',
    },
    statusPending: {
        fontSize: 10,
        color: '#d14545',
    },
    reporterText: {
        fontSize: 10,
        color: '#7d7d7d',
    },
    card: {
        marginBottom: 10,
        minHeight: 69,
        padding: 10
    },
    text: { 
        color: '#8d8d8d',  
        alignSelf: 'center'
    },
    largeFont: {
        fontSize: 28
    },
    smallFont: {
        fontSize: 10
    },
    headerIcon: {
        color: '#fff',
        fontSize: 24,
        paddingLeft: 30
    },
    touchableCard: {
        flex:1.1, 
        marginLeft: 10
    }
});

export default class IssuesManageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
            checked: [false],
            count: 0
        };
        this.loadData = this.loadData.bind(this);
        this._onValueChange = this._onValueChange.bind(this);
        
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        let {checked}= this.state;
        issues.map(issue => checked[issue.id] = false);
        this.setState({
            checked:checked,
        });
    }

    _onValueChange(id) {
        let checked = this.state.checked;
            if(checked[0]) checked[0] = false;
            checked[id] = !checked[id];
            this.setState({ checked: checked  }) 
            let count = this.state.count;
            count =  checked[id]?count+1:count-1;
            this.setState({count : count});
    }

    _renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.checkboxFlex}>
                    <RoundCheckbox
                        size={20}
                        checked={this.state.checked[item.id]}
                        onValueChange={()=> this._onValueChange(item.id)}
                        borderColor='#b5b5b5'
                        backgroundColor= '#f1b86d'
                    />
                    <TouchableOpacity 
                        onPress={() => this._onValueChange(item.id)}
                        style={styles.touchableCard}
                    >
                        <Card style={styles.card}>
                            <View style={styles.titleView}>
                                <Text style={styles.titleText}>{item.title}</Text>
                                <Text style={styles.dateText}>{item.createdAt}</Text>
                            </View>
                            <View style={styles.pendingView}>
                                {item.resolved ? 
                                (
                                    <Text style={styles.statusResolved}>Resolved</Text>
                                ) 
                                : 
                                (
                                    <Text style={styles.statusPending}>Pending</Text>
                                )}
                                <View style={styles.reporter}>
                                    <Text style={styles.reporterText}>Reported By : {item.createdBy}</Text>
                                </View>
                                    
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    
    render() {
        const { navigation } = this.props;
        const{issues} = this.props.navigation.state.params;
        const {count} = this.state;
        return (
            <View style={styles.mainWrapper}>
                <View style={styles.wrapper}>
                    <View>
                        <Text style={styles.heading}>Issues</Text>
                        <View style={styles.selectedFlex}>
                            <RoundCheckbox
                                size={20}
                                checked={this.state.checked[0]}
                                onValueChange={() => {
                                    let checked = this.state.checked;
                                    checked[0]= !checked[0];
                                    issues.map(issue => checked[issue.id] = checked[0]);
                                    this.setState({ checked, count:  checked[0]?issues.length: 0  });
                                }}
                                borderColor='#b5b5b5'
                                backgroundColor= '#f1b86d'
                            />
                            <Text style={styles.selected}>{count}(selected) </Text>
                        </View>
                        <Text> All </Text>
                    </View>
                    <FlatList
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        style={styles.list}
                        data={issues}
                        extraData={this.state}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        );
    }

    static navigationOptions = ({navigation}) => ({
        title: 'Manage Issues',
        headerLeft: <MaterialCommunityIcons name='close' style={styles.headerIcon} onPress={() => navigation.goBack()}/>,
        headerRight: null,
    });
}
