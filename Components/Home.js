import React, { Component } from 'react';
import {
  Animated,
  FlatList,
  ImageBackground,
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
      cardSlide: new Animated.Value(-80),
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
    const toggleSlideTo = this.state.showYtd ? 44 : 0;
    const cardSlideTo = this.state.showYtd ? 0 : -80;
    Animated.parallel([
      Animated.timing(this.state.toggleSlide,{
          toValue: toggleSlideTo,
          duration: 300
        }),
      Animated.timing(this.state.cardSlide,{
          toValue: cardSlideTo,
          duration: 300
        }),
    ]).start();
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
                    ? 'N/A'
                    : this.props.user.handicap;
    const handicapTitle = !this.props.user
                        ? ''
                        : this.props.user.handicap === 99
                        ? 'Add a round to find your handicap'
                        : 'Handicap'
    const monthOrYear = this.state.showYtd ? (new Date()).getFullYear() : monthMap[(new Date()).getMonth()];
    const toDateRounds = this.state.showYtd ? this.state.ytdRounds : this.state.mtdRounds;
    const toDateSpent = this.state.showYtd ? this.state.ytdSpent : this.state.mtdSpent;
    const { toggleSlide, cardSlide } = this.state;
    const yearBold = this.state.showYtd ? styles.yearMonthBold : styles.yearMonthNormal;
    const monthBold = this.state.showYtd ? styles.yearMonthNormal : styles.yearMonthBold;
    return (
      <ScrollView style={styles.home}>

        <ImageBackground blurRadius={0} imageStyle={styles.image} style={styles.imgBG} source={ require('../assets/imgs/wide_angle_course.jpeg') }>
          <View style={styles.handicapWrap}>
            <WhiteText style={ {fontSize: 19} }>{handicapTitle}</WhiteText>
            <View style={styles.handicapCircle}>
              <WhiteText style={styles.handicapNum}>{handicap}</WhiteText>
            </View>
          </View>
        </ImageBackground>

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
          <WhiteText style={styles.summaryMonthYear}>{monthOrYear}</WhiteText>
          <View style={styles.summaryColumnNames}>
            <WhiteText>Rounds</WhiteText>
            <WhiteText>Spent</WhiteText>
          </View>
          <View style={styles.summaryCard}>
            <Animated.View style={ [styles.card, styles.leftCard, { transform: [{translateY: cardSlide}] }] }>
              <Text style={styles.summaryText}>{this.state.mtdRounds}</Text>
              <Text style={styles.summaryText}>{this.state.ytdRounds}</Text>
            </Animated.View>
            <Animated.View style={ [styles.card, styles.rightCard, { transform: [{translateY: cardSlide}] }] }>
              <Text style={styles.summaryText}>${this.state.mtdSpent}</Text>
              <Text style={styles.summaryText}>${this.state.ytdSpent}</Text>
            </Animated.View>
          </View>
        </View>

        <WhiteText style={styles.prevMonths}>Previous months in {currentYear}</WhiteText>

        {pastMonths}

      </ScrollView>
    );
  }
}

const { purple, darkSeafoam, lightPurple, offWhite, seafoam, steelBlue, yellow } = colors;

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: seafoam
  },
  imgBG: {
    height: 150,
    width: '100%',
    marginBottom: 20
  },
  image: {
    width: '100%',
    resizeMode: 'cover'
  },
  handicapWrap: {
    height: '100%',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: 'rgba(0, 0, 0, .3)'
    },
  handicapCircle: {
    height: 80,
    width: 80,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: steelBlue,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: 'black',
    shadowOpacity: .8,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5
  },
  handicapNum: {
    fontSize: 20,
    fontWeight: 'bold',
    shadowColor: 'black',
    shadowOpacity: .4,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 2
  },
  toggleWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  toggleBar: {
    width: 75,
    height: 30,
    justifyContent: 'center',
    backgroundColor: steelBlue,
    borderRadius: 40,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 3,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  toggleBubble: {
    height: 25,
    width: 25,
    backgroundColor: yellow,
    borderRadius: 15
  },
  yearMonthBold: {
    fontWeight: 'bold',
  },
  yearMonthNormal: {
    fontWeight: 'normal'
  },
  summary: {
    marginBottom: 30,
    padding: 15,
    paddingBottom: 40,
    backgroundColor: steelBlue
  },
  summaryMonthYear: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  summaryColumnNames: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  summaryCard: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: offWhite,
    borderRadius: 10,
    overflow: 'hidden',
  },
  card: {
    height: 160,
    width: '50%',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
  leftCard: {
    // backgroundColor: 'darkred',
  },
  rightCard: {
    // backgroundColor: 'darkgreen'
  },
  summaryText: {
    color: offWhite,
    fontSize: 35,
    textAlign: 'center'
  },
  prevMonths: {
    marginBottom: 30,
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
