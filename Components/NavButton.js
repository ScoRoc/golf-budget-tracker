import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class NavButton extends React.Component {
  render() {
    return (
      <View onPress={() => this.props.changePage('test')} style={[styles.navButton, this.props.bgColor]}>
          <Text>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navButton: {
    flex: 1,
  }
});
