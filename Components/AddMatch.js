import React, { Component } from 'react';
import { StyleSheet, Dimensions, Animated, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

const slideTime = 850;

export default class AddMatch extends Component {
  state = {
    slideAnim: new Animated.Value(Dimensions.get('window').width)
  }

  animateClose = () => {
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: Dimensions.get('window').width,
        duration: slideTime
      }
    ).start();
    setTimeout(this.props.close, slideTime);
  }

  componentDidMount() {
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: 0,
        duration: slideTime
      }
    ).start();
  }

  render() {
    let { slideAnim } = this.state;
    return (
      <Animated.View style={[
        styles.addMatches,
        { transform: [ {translateX: slideAnim} ]}
      ]}>
        <Text>add match</Text>
        <Text onPress={this.animateClose}>~~~Close~~~</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  addMatches: {
    backgroundColor: 'yellow',
    top: 0
  }
});
