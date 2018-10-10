import React, { Component } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
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
      flipAnim: new Animated.Value(0),
      revealed: false
    }
  }

  animateReveal = () => {
    const { revealed } = this.state;
    const { height } = this.props;
    const initialHeight = revealed ? height.end : height.start;
    const finalHeight = revealed ? height.start : height.end;
    const flipValue = revealed ? 0 : 1;
    this.setState({ revealed: !this.state.revealed });
    this.state.revealAnim.setValue(initialHeight);
    Animated.parallel([
      Animated.timing(this.state.revealAnim, {
          toValue: finalHeight,
          duration: 350
        }),
      Animated.timing(this.state.flipAnim, {
          toValue: flipValue,
          duration: 350
        })
    ]).start();
  }

  handlePress = () => {
    console.log('in handlePress');
    console.log('props key: ', this.props.i)
    this.animateReveal();
  }

  componentDidMount() {
    this.state.revealAnim.setValue(this.props.height.start)
  }

  render() {
    let { revealAnim, flipAnim } = this.state;
    const flip = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-180deg']
    });
    return (
      <Animated.View style={ [styles.animated, {height: revealAnim}] }>
        <View>
          <TouchableWithoutFeedback onPress={this.handlePress}>
            <View style={styles.titleWrap}>
              <View style={styles.title}>
                <WhiteText style={styles.monthName}>{this.props.name}</WhiteText>
                <Animated.View style={ {transform: [ {rotateZ: flip} ]} }>
                  {/* <Text>foo</Text> */}
                  <Icon
                    name='chevron-down'
                    type='font-awesome'
                    size={20}
                    color={colors.yellow}
                    iconStyle={styles.icon}
                  />
                </Animated.View>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
    backgroundColor: seafoam,
  },
  animated: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: offWhite,
    overflow: 'hidden'
  },
  titleWrap: {
    alignItems: 'center'
  },
  title: {
    width: '35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  monthName: {
    fontSize: 18
  }
});
