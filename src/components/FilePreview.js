/**
 * InputComponent with validations on integration with redux-form
 */
import React from 'react';

import { View, StyleSheet, ImageBackground } from 'react-native';

import { Text } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    previewWrapper: {

    },
    singlePreview: {
        display: 'flex',
        flexDirection: 'column'
    },
    preview: {
        height: 100,
        width: 100,
    },
    removeIcon: {
        color: 'red',
        position: 'absolute',
        right: 0,
        top: 0,
    }
});

export default class FilePreview extends React.Component {
    _renderFilePreview = () => {
        const { files, removeFile } = this.props;
        return files.map((file, index) => {
            return (
                <View style={styles.singlePreview} key={index}>
                    <ImageBackground source={require('../assets/images/uploaded.png')} style={styles.preview}>
                        <Ionicons name="ios-remove-circle" size={24} style={styles.removeIcon} onPress={() => removeFile(index)} />
                    </ImageBackground>
                    <Text>
                        {file.fileName}
                    </Text>
                </View>
            )
        });
    }

    render() {
        let { files } = this.props;
        return (
            <View style={styles.previewWrapper}>
                {this._renderFilePreview()}
            </View>
        )
    }
}
