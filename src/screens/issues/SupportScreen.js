import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { colors } from '../../styles';
import { Card, Icon } from 'native-base';
import ActionButton from 'react-native-action-button';
import Api from '../../services/api';


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5'
    },
    heading: {
        color: colors.colorPrimary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    listStyle: {
        marginTop: 12,
    },
    card: {
        marginBottom: 10,
        minHeight: 69,
        padding: 10,
        display: 'flex',
    },
    wrapper: {
        padding: 30,
        flex: 1,
        marginBottom: 75
    },
    actionButton: {
        zIndex: 1,
        flex: 1,
        position: 'absolute',
        top: -12,
        right: -7
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
    reporter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    reporterText: {
        fontSize: 10,
        color: '#7d7d7d',
        marginRight: 10,
    },
    imageCircular: {
        height: 22,
        width: 22,
        borderRadius: 11,
    },
    actionButtonIcon: {
        fontSize: 18,
        color: '#fff'
    },
    touchableCard: {
        flex: 1
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

export default class SupportScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            issues: [],
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try{
            let res = await Api.issue.list();
            this.setState({ issues: res.results });
        }
        catch (err) {
            console.log(err);
        }
    }

    _renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const imageSource = item.image ? { uri: item.image } : require('../../assets/images/club.png');
        return (
            <TouchableOpacity style={styles.touchableCard} onPress={() => navigate('IssuesReport', item)}>
                <Card style={styles.card}>
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>{item.title}</Text>
                        <Text style={styles.dateText}>{moment(item.createdAt).format('YYYY/MM/DD hh:mm')}</Text>
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
                            <Image source={imageSource} style={styles.imageCircular} />
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    render() {
        const { navigation } = this.props;
        const { issues } = this.state;
        // this.setState({  })
        return (
            <ScrollView style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.heading}>Issues</Text>
                    <FlatList contentContainerStyle={styles.listStyle}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollBar={false}
                        data={issues}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this._renderItem}
                    />
                </View>
                <ActionButton style={styles.actionButton}
                    buttonColor={colors.colorAccent}
                    renderIcon={() => <MaterialCommunityIcons name='plus' style={styles.plusIcon} />}
                    size={32}
                    offsetY={30}
                    offsetX={30}
                    verticalOrientation="down"
                    elevation={2}
                    bgColor="rgba(245, 245, 245, .92)">
                    <ActionButton.Item buttonColor='#9b59b6' title="Report" onPress={() => navigation.navigate('SubmitIssue')}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </ScrollView >
        );

    }

    static navigationOptions = () => ({
        title: 'Support',
        drawerIcon: () => (<Entypo name='align-top' style={styles.drawerIconStyle} />)
    });

}
