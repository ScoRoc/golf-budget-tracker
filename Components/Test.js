import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Test extends Component {
  render() {
    return (
      <View style={styles.home}>
          <Text>Test page</Text>
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
