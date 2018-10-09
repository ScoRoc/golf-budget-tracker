import React, { Component } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { colors } from '../global_styles/colors';
import WhiteText from './Text/WhiteText';

const monthMap = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export default class HomeMonth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      revealAnim: new Animated.Value(),
      revealed: false
    }
  }

  animateReveal = () => {
    console.log('in animateReveal');
    let initialHeight = this.state.revealed ? this.props.heights.end : this.props.heights.start;
    let finalHeight = this.state.revealed ? this.props.heights.start : this.props.heights.end;
    this.setState({ revealed: !this.state.revealed });
    this.state.revealAnim.setValue(initialHeight);
    Animated.timing(
      this.state.revealAnim,
      {
        toValue: finalHeight,
        duration: 350
      }
    ).start();
  }

  handlePress = () => {
    console.log('in handlePress');
    this.animateReveal();
    this.props.showMonthDetails(this.props.key);
  }

  componentDidMount() {
    this.state.revealAnim.setValue(this.props.heights.start)
  }

  render() {
    let { revealAnim } = this.state;
    return (
      <Animated.View style={ [styles.month, {height: revealAnim}] }>
        <View>
          <WhiteText onPress={this.handlePress}>{this.props.name}</WhiteText>
          {this.props.children}
        </View>
      </Animated.View>
    )
  }
}

const { purple, darkSeafoam, lightPurple, offWhite, seafoam } = colors;

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignSelf: 'stretch',
    // backgroundColor: '#bfd',
    backgroundColor: seafoam,
  },
  month: {
    // height: 40,
    borderBottomWidth: 1,
    borderBottomColor: offWhite,
    marginBottom: 15,
  }
});
