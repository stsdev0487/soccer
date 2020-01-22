/**
 * InputComponent with validations on integration with redux-form
 */
import React from 'react';

import { View, StyleSheet, Modal, Alert, ActivityIndicator, Image } from 'react-native';

import { Text } from 'native-base';
import Api from '../services/api';
import { colors } from '../styles';

const styles = StyleSheet.create({
    singleImage: {
        height: 100,
        width: 100,
        marginRight: 10,
        marginBottom: 10
    },
    imageWrapper: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    modalWrapper: {
        margin: 15,
        marginTop: 50
    },
    uploadingText: {
        
    },
    progressOverlay: {
        position: 'absolute',
        zIndex: 2,
        left: 35,
        top: 35
    },
    overlay: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: 100,
        height: 100,
        zIndex: 1
    },
    overlayWrapper: {
        marginTop: 10
    }
});

export default class MultiUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemUploading: 1,
            progress: 0
        };
    }

    componentDidMount() {
        this._uploadItems();
    }

    _onProgress = (progress) => {
        this.setState({ progress });
    }

    _cancelUpload = () => {
        Alert.alert('Upload has been cancelled.');
    }

    _uploadItems = async() => {
        let { items, apiKey, successMsg, routeName, onUploadComplete } = this.props;
        for (const item of items) {
            await Api[apiKey].create(item, this._onProgress).then(() => {
                if(item===items[items.length-1]) {
                    // navigation.navigate(routeName, {club: item, message: 'Successfully added images.'})
                    onUploadComplete();
                } else {
                    this.setState({ progress: 0, itemUploading: this.state.itemUploading+1 });
                }
            }).catch(err => {
                console.log(err);
                this.setState({ progress: 0 });
            });
        }
    }

    _renderItems = () => {
        let { items } = this.props;
        let {itemUploading} = this.state;
        return items.map((item, index) => {
            let uIndex = index+1;
            if(itemUploading===uIndex){
                return (
                    <View key={index} style={styles.overlayWrapper}>
                        <ActivityIndicator size="large" color={colors.colorPrimary} style={styles.progressOverlay} />
                        <View style={styles.overlay} />
                        <Image style={styles.singleImage} source={{ uri: item.path }} />
                    </View>
                );
            }
            else if(uIndex < itemUploading){
                return (
                    <View key={index} style={styles.overlayWrapper}>
                        <Image style={styles.singleImage} source={{ uri: item.path }} />
                    </View>
                );
            } else if(uIndex > itemUploading){
                return (
                    <View key={index} style={styles.overlayWrapper}>
                        <View style={styles.overlay} />
                        <Image style={styles.singleImage} source={{ uri: item.path }} />
                    </View>
                );
            }
        })
    }
    render() {
        const { itemUploading, progress } = this.state;
        let { items, visible } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.modalWrapper}>
                    <View>
                        <Text style={styles.uploadingText}>Uploading({`${itemUploading}/${items.length}`})</Text>
                        <View style={styles.imageWrapper}>
                            {this._renderItems()}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}