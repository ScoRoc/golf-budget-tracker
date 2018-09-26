import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class YourMatches extends Component {
  render() {
    return (
      <View style={styles.home}>
          <Text>YourMatches page</Text>
          <Text>CourseName____Date____Score____Price</Text>
          <Text>Notes_____________</Text>
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
