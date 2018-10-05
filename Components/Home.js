import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default class Home extends Component {
  render() {
    const handicap  = !this.props.user
                    ? ''
                    : this.props.user.handicap === 0
                    ? 'Add a round to find your handicap'
                    : this.props.user.handicap;
    return (
      <View style={styles.home}>
          <Text>Home page</Text>

          <Text>Your handicap: {handicap}</Text>

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
