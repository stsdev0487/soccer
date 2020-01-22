import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'native-base';

const { width}= Dimensions.get('window');
const styles = StyleSheet.create({
    footer: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
        borderTopWidth: 1,
        borderColor: '#d1d1d1',
        alignItems: 'center',
    },   
    footerDelBtn: { 
        flex: 1, 
        alignSelf: 'center' 
    },
    footerBtn: { 
        flex: 1, 
        alignSelf: 'center' 
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
    }
});

export default class InputComponent extends React.Component {
    constructor(props){
        super(props);
        this._onDeleteClick = this._onDeleteClick.bind(this);
    }

    _onDelete = () => {
        const { deleteItems } = this.props;
        deleteItems();
    }

    _onDeleteClick() {
        Alert.alert(
          'Confirmation',
          'Are you sure to delete the selected items?',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Confirm', onPress: this._onDelete },
          ],
          { cancelable: true }
        )
      }

    render() {
        const { navigation, movePlayer, deleteItems, addPlayer } = this.props;
        return (
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerDelBtn} onPress={this._onDeleteClick}>
                    <MaterialCommunityIcons name='delete' style={[styles.text,styles.largeFont]} />
                    <Text style={[styles.text,styles.smallFont]} >Delete</Text>
                </TouchableOpacity>
                {addPlayer &&
                    <TouchableOpacity style={styles.footerAddBtn} onPress={addPlayer}>
                    <MaterialCommunityIcons name='plus' style={[styles.text,styles.largeFont]} />
                    <Text style={[styles.text,styles.smallFont]} >Add To</Text>
                </TouchableOpacity>
                }
                
                {movePlayer &&
                    <TouchableOpacity style={styles.footerBtn} onPress={movePlayer}>
                        <MaterialCommunityIcons name='reply-all' style={[styles.text,styles.largeFont]} />
                        <Text style={[styles.text,styles.smallFont]}> Move To</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    static defaultProps = {
        movePlayer: null,
        deleteItems: null
    }
}
