import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';

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

  showMonthDetails = i => {
    const pastMonths = [...this.state.pastMonths];
    pastMonths[i].show = !this.state.pastMonths[i].show;
    this.setState({pastMonths});
  }

  render() {
    const pastMonths = this.state.pastMonths.map((month, i) => {
      const details = month.show
                    ? <View>
                        <Text>{month.rounds} rounds played</Text>
                        <Text>${month.spent} spent</Text>
                      </View>
                    : '';
      return (
        <View key={i}>
          <Text onPress={() => this.showMonthDetails(i)}>{month.name}</Text>
          {details}
          <Text>-------</Text>
        </View>
      )
    });
    const handicap  = !this.props.user
                    ? ''
                    : this.props.user.handicap === 99
                    ? 'Add a round to find your handicap'
                    : this.props.user.handicap;
    return (
      <ScrollView style={styles.home}>
          <Text>Home page</Text>

          <Text>Your handicap index: {handicap}</Text>
          <Text>Rounds played in {currentYear}: {this.state.ytdRounds}</Text>
          <Text>You've spent ${this.state.ytdSpent} in {currentYear}</Text>
          <Text>Rounds played in {monthMap[currentMonth]}: {this.state.mtdRounds}</Text>
          <Text>You've spent ${this.state.mtdSpent} in {monthMap[currentMonth]}</Text>

          {pastMonths}

      </ScrollView>
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
