import React from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card } from 'native-base';
import moment from 'moment';
import { colors } from '../styles';

const styles = StyleSheet.create({
    player: {
        marginBottom: 6,
        marginTop: 6,
        minHeight: 54,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    detail: {
        display: 'flex',
        flex: 1
    },
    nameWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    playerName: {
        color: colors.colorPrimaryGrey,
        fontSize: 12,
        fontWeight: 'bold',

    },
    playerId: {
        color: '#8d8d8d',
        fontSize: 10,
        fontWeight: 'bold',
    },
    playerInfo: {
        color: colors.colorSecondaryGrey,
        fontSize: 10,
    },
    image: {
        marginRight: 10,
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    unverified: {
        color: 'red',
        fontSize: 14,
        marginLeft: 10
    },
    certificate: {
        color: 'orange',
        fontSize: 14,
        marginLeft: 10
    },
    verified: {
        color: 'green',
        fontSize: 14,
        marginLeft: 10
    },
    pending: {
        color: 'yellow',
        fontSize: 14,
        marginLeft: 10
    },
    changes_requested: {
        color: 'brown',
        fontSize: 14,
        marginLeft: 10
    },
});

export default ({ item, navigation }) => {
    const { navigate } = navigation;
    const imageSource = item.image ? { uri: item.image } : require('../assets/images/club.png');

    let status = item.status;
    if(status == 'unverified' && item.certificateFile) {
        status = 'certificate';
    }
    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('PlayerProfile', { player: item })}
            >
                <Card style={styles.player}>
                    <Image source={imageSource} style={styles.image} />
                    <View style={styles.detail}>
                        <View style={styles.nameWrapper}>
                            <Text style={styles.playerName}>
                                {item.firstName} {item.lastName}
                            </Text>
                            <Ionicons name='ios-checkmark-circle' style={styles[status]} />
                            <Text style={styles.playerId}> ID: {item.id} </Text>
                        </View>
                        <Text style={styles.playerInfo}>{item.jerseyNumber}</Text>
                        <Text style={styles.playerInfo}>Age: {moment().diff(item.dob, 'years', false)} years</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    );
}
