import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import axios from 'axios';

export default class YourCourses extends Component {

  tester = () => {
    axios.get('http://localhost:3000/api').then(result => {
      console.log('from front. heres result.data: ', result.data);
    });
  }

  render() {
    return (
      <View style={styles.home}>
          <Text>YourCourses page</Text>
          <Button onPress={this.tester} title='Backend test' />
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
