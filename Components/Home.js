import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Home extends Component {
  render() {
    return (
      <View style={styles.home}>
          <Text>Home page</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#bfd'
  }
});
