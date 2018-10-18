import React, { Component } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Keyboard,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { colors } from '../../global_styles/colors';
import WhiteText from '../Text/WhiteText';

export default class AddTeebox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      showAddTeebox: false,
      name: '',
      rating: '',
      slope: ''
    }
  }

  addTeebox = () => {
    const { name } = this.state;
    const rating = parseFloat(this.state.rating);
    const slope = parseInt(this.state.slope);
    axios.post(`http://${this.props.api}/api/teebox`, {  /////// FIX URL
      name,
      rating,
      slope,
      courseId: this.props.course._id,
      userId: this.props.user._id
    }).then(result => {
      if (this.props.updateCourse) {
        this.props.updateCourse(result.data.newTeebox, null, 'add');
      }
      this.props.getUserInfo();
      this.animateClose();
    });
  }

  packTeebox = () => {
    const { name } = this.state;
    const rating = parseFloat(this.state.rating);
    const slope = parseInt(this.state.slope);
    let teebox = { name, rating, slope };
    this.props.addTeebox(teebox);
    this.animateClose();
  }

  findDuration = y => {
    const third = Dimensions.get('window').height / 3;
    let time = 0;
    switch (true) {
      case y < third * .25:
        time = 50;
        break;
      case y >= third * .25 && y < third * .5:
        time = 100;
        break;
      case y >= third * .5 && y < third * .75:
        time = 150;
        break;
      case y >= third * .75:
        time = 200;
        break;
      default:
        time = 250;
    }
    return time;
  }

  animateReset = y => {
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: 0,
        duration: this.findDuration(y)
      }
    ).start();
  }

  animateClose = y => {
    const time = this.findDuration(y);
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: Dimensions.get('window').height,
        duration: time
      }
    ).start();
    setTimeout(this.props.close, time);
  }

  componentWillMount() {
    const threshold = 8;
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => Math.abs(gestureState.dy) >= threshold,
      onPanResponderMove: (e, gestureState) => {
        const { dy } = gestureState;
        if (dy >= 0) {
          this.state.slideAnim.setValue(dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy } = gestureState;
        const closeSpeed = 0.85;
        const third = Dimensions.get('window').height / 3;
        if (vy >= closeSpeed || dy >= third) {
          this.animateClose(dy);
        } else {
          this.animateReset(dy);
        }
        return false;
      }
    })
  }

  componentDidMount() {
    const time = 350;
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: 0,
        duration: time
      }
    ).start();
  }

  render() {
    let { slideAnim } = this.state;
    let addTeebox = this.props.course ? this.addTeebox : this.packTeebox;
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={ [styles.addTeeboxWrapper, { transform: [{translateY: slideAnim}] }] }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.addTeeboxView}>

            <WhiteText style={styles.pageTitle}>Add a teebox</WhiteText>

            <WhiteText>Teebox name</WhiteText>
            <TextInput
              returnKeyType='next'
              onSubmitEditing={() => this.ratingInput.focus()}
              value={this.state.name}
              onChangeText={name => this.setState({name})}
              style={styles.textInput}
            />

            <WhiteText>Rating</WhiteText>
            <TextInput
              ref={input => this.ratingInput = input}
              onSubmitEditing={() => this.slopeInput.focus()}
              value={this.state.rating}
              onChangeText={rating => this.setState({rating})}
              keyboardType='numeric'
              maxLength={4}
              style={styles.textInput}
            />

            <WhiteText>Slope</WhiteText>
            <TextInput
              ref={input => this.slopeInput = input}
              value={this.state.slope}
              onChangeText={slope => this.setState({slope})}
              keyboardType='numeric'
              maxLength={3}
              style={styles.textInput}
            />

            <TouchableOpacity style={styles.addTeeboxButton} onPress={addTeebox} activeOpacity={.5}>
              <WhiteText style={ {fontSize: 20, fontWeight: 'bold'} }>Add course</WhiteText>
            </TouchableOpacity>

            <WhiteText style={ {marginTop: 15, textAlign: 'center'} }>Swipe down to cancel</WhiteText>
            <Icon
              name='chevron-down'
              type='font-awesome'
              size={50}
              color={offWhite}
            />

          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const { lightOrange, mediumGrey, offWhite, yellow } = colors;

const styles = StyleSheet.create({
  addTeeboxWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightOrange,
    zIndex: 20
  },
  addTeeboxView: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15
  },
  pageTitle: {
    marginTop: 20,
    marginBottom: 40,
    fontSize: 26,
    textAlign: 'center'
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: mediumGrey,
    color: offWhite,
    fontSize: 16
  },
  addTeeboxWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addTeebox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30
  },
  addTeeboxButton: {
    alignSelf: 'center',
    height: 50,
    width: '70%',
    marginTop: 60,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: yellow,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: .4,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0}
  }
});
