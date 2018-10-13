import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

const Header = props => {
  return (
    // <View style={styles.header}>
    //   <Text>Hello User: {props.userName}</Text>
    //   <TouchableHighlight onPress={props.logout} underlayColor='rgb(102, 51, 153)'>
    //     <View style={styles.logout}>
    //       <Icon name='lock' />
    //       <Text style={ {marginLeft: 10} }>Logout</Text>
    //     </View>
    //   </TouchableHighlight>
    // </View>
    <View style={ [styles.header, {backgroundColor: props.color}]}></View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    width: '100%'
  },
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   height: 80,
  //   paddingTop: 50,
  //   paddingLeft: 10,
  //   alignSelf: 'stretch',
  //   backgroundColor: '#5dd'
  // },
  // logout: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingRight: 10
  // }
});

export default Header;
