import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default class Home extends Component {
  render() {
    console.log('props user: ', this.props.user);
    return (
      <View style={styles.home}>
          <Text>Home page</Text>

          <Text>Your handicap:</Text>

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
