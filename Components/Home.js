import React, { Component } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { colors } from '../global_styles/colors';
import HomeMonth from './HomeMonth'
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
      showYtd: true,
      ytdRounds: 0,
      ytdSpent: 0,
      mtdRounds: 0,
      mtdSpent: 0,
      pastMonths: []
    }
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
      pastMonths.push( {name: monthMap[i], rounds: 0, spent: 0} );
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
    const pastMonths = this.state.pastMonths.map((month, i) => {
      const details = (
                      <View style={styles.detailsWrap}>
                        <View style={styles.detailsColumn}>
                          <WhiteText>Rounds</WhiteText>
                          <WhiteText>{month.rounds}</WhiteText>
                        </View>
                        <View style={styles.detailsColumn}>
                          <WhiteText>Spent</WhiteText>
                          <WhiteText>${month.spent}</WhiteText>
                        </View>
                      </View>
                    );
      return (
        <HomeMonth
          key={i}
          i={i}
          name={month.name}
          height={ {start: 40, end: 100} }
        >
          {details}
        </HomeMonth>
      )
    });
    const handicap  = !this.props.user
                    ? ''
                    : this.props.user.handicap === 99
                    ? 'Add a round to find your handicap'
                    : this.props.user.handicap;
    const toDateRounds = this.state.showYtd ? this.state.ytdRounds : this.state.mtdRounds;
    const toDateSpent = this.state.showYtd ? this.state.ytdSpent : this.state.mtdSpent;
    const monthOrYear = this.state.showYtd ? 'Year' : 'Month';
    return (
      <ScrollView style={styles.home}>

        <WhiteText>Your handicap index: {handicap}</WhiteText>
        <WhiteText>Rounds played in {currentYear}: {this.state.ytdRounds}</WhiteText>
        <WhiteText>You've spent ${this.state.ytdSpent} in {currentYear}</WhiteText>
        <WhiteText>Rounds played in {monthMap[currentMonth]}: {this.state.mtdRounds}</WhiteText>
        <WhiteText>You've spent ${this.state.mtdSpent} in {monthMap[currentMonth]}</WhiteText>

        <Text onPress={() => this.setState({showYtd: !this.state.showYtd})}>Month or Year</Text>
        <Text>Showing {monthOrYear}</Text>

        <View style={styles.summary}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{toDateRounds}</Text>
            {/* <Text style={styles.summaryText}>|</Text> */}
            <Text style={styles.summaryText}>${toDateSpent}</Text>
          </View>
        </View>

        {pastMonths}

      </ScrollView>
    );
  }
}

const { purple, darkSeafoam, lightPurple, offWhite, seafoam, steelBlue } = colors;

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignSelf: 'stretch',
    // backgroundColor: '#bfd',
    backgroundColor: seafoam,
  },
  summary: {
    padding: 8,
    // backgroundColor: '#436f88'
    backgroundColor: steelBlue
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: offWhite,
    borderRadius: 10
  },
  summaryText: {
    color: offWhite,
    fontSize: 35
  },
  detailsWrap: {
    marginTop: 11,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  detailsColumn: {
    alignItems: 'center'
  }
});
