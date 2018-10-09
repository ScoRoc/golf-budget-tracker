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

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      revealAnim: new Animated.Value(40),
      revealed: false,
      ytdRounds: 0,
      ytdSpent: 0,
      mtdRounds: 0,
      mtdSpent: 0,
      pastMonths: []
    }
  }

  animateReveal = () => {
    let initialHeight = this.state.revealed ? 40 : 100;
    let finalHeight = this.state.revealed ? 100 : 40;
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

  showMonthDetails = i => {
    const pastMonths = [...this.state.pastMonths];
    pastMonths[i].show = !this.state.pastMonths[i].show;
    this.setState({pastMonths});
  }

  componentDidMount() {
    const rounds = this.props.rounds;
    const ytdRounds = [];
    let ytdSpent = 0;
    const mtdRounds = [];
    let mtdSpent = 0;
    const pastMonths = [];
    const month = round => new Date(round.date).getMonth();
    for (let i = 0; i < currentMonth; i++) {
      pastMonths.push( {name: monthMap[i], rounds: 0, spent: 0, show: false} );
    }
    rounds.forEach(round => {
      if (new Date(round.date).getFullYear() === currentYear) ytdRounds.push(round);
      if (month(round) === currentMonth) mtdRounds.push(round);
    });
    if (ytdRounds.length !== 0) ytdSpent = ytdRounds.map(round => round.price).reduce((acc, cur) => acc + cur);
    if (mtdRounds.length !== 0) mtdSpent = mtdRounds.map(round => round.price).reduce((acc, cur) => acc + cur);
    ytdRounds.forEach(round => {
      if (month(round) !== currentMonth) {
        pastMonths[month(round)].rounds += 1;
        pastMonths[month(round)].spent += round.price;
      }
    });
    pastMonths.reverse();
    this.setState({
      ytdRounds: ytdRounds.length,
      ytdSpent,
      mtdRounds: mtdRounds.length,
      mtdSpent,
      pastMonths
    })
  }

  render() {
    let { revealAnim } = this.state;
    const pastMonths = this.state.pastMonths.map((month, i) => {
      const details = month.show
                    ? <View>
                        <WhiteText>{month.rounds} rounds played</WhiteText>
                        <WhiteText>${month.spent} spent</WhiteText>
                      </View>
                    : '';
      return (
        <Animated.View key={i} style={ [styles.months, {height: revealAnim}] }>
          <View>
            {/* onPress={() => this.showMonthDetails(i)} */}
            <WhiteText onPress={this.animateReveal}>{month.name}</WhiteText>
            {details}
          </View>
        </Animated.View>
      )
    });
    const handicap  = !this.props.user
                    ? ''
                    : this.props.user.handicap === 99
                    ? 'Add a round to find your handicap'
                    : this.props.user.handicap;
    return (
      <ScrollView style={styles.home}>

          <WhiteText>Your handicap index: {handicap}</WhiteText>
          <WhiteText>Rounds played in {currentYear}: {this.state.ytdRounds}</WhiteText>
          <WhiteText>You've spent ${this.state.ytdSpent} in {currentYear}</WhiteText>
          <WhiteText>Rounds played in {monthMap[currentMonth]}: {this.state.mtdRounds}</WhiteText>
          <WhiteText>You've spent ${this.state.mtdSpent} in {monthMap[currentMonth]}</WhiteText>

          {pastMonths}

      </ScrollView>
    );
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
  months: {
    // height: 40,
    borderBottomWidth: 1,
    borderBottomColor: offWhite,
    marginBottom: 15,
  }
});
