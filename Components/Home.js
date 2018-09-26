import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default class Home extends Component {
  render() {
    return (
      <View style={styles.home}>
          <Text>Home page</Text>
          <FlatList
            data={[
              {key: 'Dates'},
              {key: 'Course name'},
              {key: 'Price'},
              {key: 'Score'},
              {key: 'Bright colors'},
              {key: 'Place for notes'},
              {key: 'Week and month and year'},
              {key: 'Average score by course'},
              {key: 'Number of birdies in a round'},
              {key: 'Number of double bogies and bogies in a round'}
            ]}
            renderItem={( {item} ) => <Text>{item.key}</Text>}
          />
          <Text>____TEST____</Text>
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
