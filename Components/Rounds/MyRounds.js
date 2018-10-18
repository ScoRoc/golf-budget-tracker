import React, { Component } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../../global_styles/colors';
import WhiteText from '../Text/WhiteText';
import AddRound from './AddRound';
import Round from './Round';


export default class MyRounds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddRound: false,
      showRound: false,
      currentRound: {}
    }
  }

  touchRound = idx => {
    this.setState({currentRound: this.props.rounds[idx], showRound: true});
  }

  render() {
    let rounds = this.props.rounds.map( (round, id) => {
      return (
        <TouchableHighlight
           onPress={() => this.touchRound(id)}
           style={styles.roundOuterWrap}
           underlayColor='rgb(102, 51, 153)'
           key={id}
        >
          <View style={styles.roundInnerWrap}>

            <View style={styles.roundDateAndScoreWrap}>

              <View style={styles.roundScoreBox}>
                <WhiteText style={ {fontSize: 11} }>Score</WhiteText>
                <WhiteText style={ {fontSize: 20} }>{round.score}</WhiteText>
              </View>

              <View style={styles.roundDateAndCourseName}>
                <WhiteText style={ {fontSize: 12} }>{(new Date(round.date)).toDateString()}</WhiteText>
                <WhiteText style={styles.roundCourseName}>{round.courseName}</WhiteText>
              </View>

            </View>

            <Icon
              name='chevron-right'
              type='font-awesome'
              size={20}
              color={colors.yellow}
              iconStyle={styles.icon}
            />

          </View>
        </TouchableHighlight>
      );
    });
    let addRound = this.state.showAddRound
                  ? <AddRound
                      api={this.props.api}
                      user={this.props.user}
                      courses={this.props.courses}
                      getUserInfo={this.props.getUserInfo}
                      close={() => this.setState({showAddRound: false})}
                    />
                  : '';
    let roundPage = this.state.showRound
                  ? <Round
                      api={this.props.api}
                      user={this.props.user}
                      round={this.state.currentRound}
                      courses={this.props.courses}
                      getUserInfo={this.props.getUserInfo}
                      close={() => this.setState({showRound: false})}
                    />
                  : '';
    return (
      <View style={styles.myRounds}>

        <ScrollView contentContainerStyle={ {flexGrow: 1} }>

          <ImageBackground blurRadius={0} imageStyle={styles.image} style={styles.imgBG} source={ require('../../assets/imgs/flag_and_water.jpeg') }>
            <View style={styles.titleWrap}>
              <WhiteText style={styles.title}>My rounds</WhiteText>
            </View>
          </ImageBackground>

          <View style={styles.addRoundWrap}>
            <TouchableOpacity onPress={() => this.setState({showAddRound: true})} activeOpacity={.5}>
              <View style={styles.addRound}>
                <Icon color={offWhite} size={45} name='add-circle-outline' />
                <WhiteText style={ {fontSize: 11, fontWeight: 'bold'} }>Add a round</WhiteText>
              </View>
            </TouchableOpacity>
          </View>

          {rounds}

        </ScrollView>

        {roundPage}
        {addRound}

      </View>
    );
  }
}

const { darkOffWhite, lightOrange, lightPurple, offWhite, purple, yellow } = colors;

const styles = StyleSheet.create({
  myRounds: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: lightPurple
  },
  imgBG: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    resizeMode: 'cover'
  },
  titleWrap: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)'
  },
  title: {
    fontSize: 23,
  },
  addRoundWrap: {
    marginTop: 35,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: .4,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0}
  },
  addRound: {
    height: 85,
    width: 85,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: yellow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkOffWhite,
    borderRadius: 15
  },
  roundOuterWrap: {
    width: '100%',
    alignItems: 'center'
  },
  roundInnerWrap: {
    width: '90%',
    marginBottom: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: darkOffWhite
  },
  roundDateAndScoreWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roundScoreBox: {
    height: 50,
    width: 50,
    marginRight: 10,
    padding: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: lightOrange,
    borderRadius: 5
  },
  roundDateAndCourseName: {
    width: '77%',
    flexWrap: 'wrap'
  },
  roundCourseName: {
    fontSize: 18
  }
});
