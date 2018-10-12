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
      toggleSlide: new Animated.Value(0),
      ytdRounds: 0,
      ytdSpent: 0,
      mtdRounds: 0,
      mtdSpent: 0,
      pastMonths: []
    }
  }

  toggleSlide = () => {
    const { showYtd } = this.state;
    this.setState({showYtd: !this.state.showYtd})
    const slideTo = this.state.showYtd ? 44 : 0;
    Animated.timing(
      this.state.toggleSlide,
      {
        toValue: slideTo,
        duration: 350
      }
    ).start();
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
    const monthOrYear = this.state.showYtd ? (new Date()).getFullYear() : monthMap[(new Date()).getMonth()];
    const toDateRounds = this.state.showYtd ? this.state.ytdRounds : this.state.mtdRounds;
    const toDateSpent = this.state.showYtd ? this.state.ytdSpent : this.state.mtdSpent;
    const { toggleSlide } = this.state;
    const yearBold = this.state.showYtd ? styles.yearMonthBold : styles.yearMonthNormal;
    const monthBold = this.state.showYtd ? styles.yearMonthNormal : styles.yearMonthBold;
    return (
      <ScrollView style={styles.home}>

        <WhiteText>Your handicap index: {handicap}</WhiteText>

        <View style={styles.toggleWrap}>
          <WhiteText style={yearBold}>Year</WhiteText>
          <TouchableWithoutFeedback onPress={() => this.toggleSlide()}>
            <View style={styles.toggleBar}>
              <Animated.View
                style={[
                  styles.toggleBubble,
                  { transform: [ {translateX: toggleSlide} ] }
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
          <WhiteText style={monthBold}>Month</WhiteText>
        </View>

        <View style={styles.summary}>
          <WhiteText style={ {textAlign: 'center'} }>{monthOrYear}</WhiteText>
          <View style={styles.summaryCard}>
            <View style={ [styles.card, styles.leftCard] }>
              <Text style={styles.summaryText}>{toDateRounds}</Text>
            </View>
            <View style={ [styles.card, styles.rightCard] }>
              <Text style={styles.summaryText}>${toDateSpent}</Text>
            </View>
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
  toggleWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  toggleBar: {
    width: 75,
    height: 30,
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 40,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 3,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 4
  },
  toggleBubble: {
    height: 25,
    width: 25,
    backgroundColor: 'grey',
    borderRadius: 15
  },
  yearMonthBold: {
    fontWeight: 'bold',
    // fontSize: 18
  },
  yearMonthNormal: {
    fontWeight: 'normal'
  },
  summary: {
    marginBottom: 30,
    padding: 15,
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
  card: {
    width: '50%',
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
  },
  leftCard: {
    backgroundColor: 'darkred'
  },
  rightCard: {
    backgroundColor: 'darkgreen'
  },
  summaryText: {
    color: offWhite,
    fontSize: 35,
    textAlign: 'center'
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
