import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    icon: {
        fontSize: 24,
        color: 'white',
        marginHorizontal: 20
    },
});
const SearchButton = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { console.log('pressed') }} >
                <MaterialIcons style={styles.icon} name='search' />
            </TouchableOpacity>
        </View>
    );
};

export default SearchButton;
