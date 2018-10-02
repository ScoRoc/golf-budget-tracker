import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Signup from './Signup';
import Login from './Login';

export default class NavButton extends React.Component {
  render() {
    return (
      <View style={styles.auth}>
        <Signup liftToken={this.props.liftToken} />
        <Text>-- or --</Text>
        <Login getUserInfo={this.props.getUserInfo} liftToken={this.props.liftToken} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  auth: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#bfd'
  }
});
