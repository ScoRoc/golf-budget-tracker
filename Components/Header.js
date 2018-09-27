import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.header}>
        <Text>Hello User: {this.props.userName}</Text>
        <TouchableHighlight onPress={this.props.logout} underlayColor='rgb(102, 51, 153)'>
          <View style={styles.logout}>
            <Text style={ {marginRight: 10} }>Logout</Text>
            <Icon name='lock' />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    paddingTop: 50,
    paddingLeft: 10,
    alignSelf: 'stretch',
    backgroundColor: '#5dd'
  },
  logout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10
  }
});
