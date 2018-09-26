import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

export default class NavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        onPress={() => this.props.changePage(this.props.nav.page)}
        style={[styles.navButton, this.props.bgColor]}
        underlayColor='rgb(102, 51, 153)'
        // underlayColor='#b1be2e'
        >
          <Text>{this.props.nav.text}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  navButton: {
    flex: 1,
  }
});
