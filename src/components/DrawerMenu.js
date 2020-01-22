import React  from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingLeft: 4,
    zIndex: 999
  },
  image: {
    height: 20,
    width: 20,
    marginLeft: 20
  }
});

export default function DrawerMenu({style={}, navigation}) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={() => navigation.toggleDrawer()}>
      <Image source={require('../assets/images/menu.png')} style={styles.image} />
    </TouchableOpacity>
  );
}
