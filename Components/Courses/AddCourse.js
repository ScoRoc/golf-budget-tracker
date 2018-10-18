import React, { Component } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Keyboard,
  PanResponder,
  ScrollView,
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
import AddTeebox from '../Teeboxes/AddTeebox';
import PendingTeebox from '../Teeboxes/PendingTeebox';

export default class AddCourse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      scrollDimensions: null,
      showAddTeebox: false,
      showTeebox: false,
      pendingTeeboxMoving: false,
      currentTeebox: '',
      currentTeeboxIdx: '',
      courseName: '',
      notes: '',
      teeboxes: []
    }
  }

  updatePendingTeeboxMoving = bool => {
    this.setState({pendingTeeboxMoving: bool});
  }

  addCourse = () => {
    axios.post(`http://${this.props.api}/api/course`, {  ///////// FIX URL
      courseName: this.state.courseName,
      notes: this.state.notes,
      user: this.props.user,
      teeboxes: this.state.teeboxes
    }).then(result => {
      console.log('result: ', result.data);
      this.props.getUserInfo();
      if (this.props.setCourse) {
        let newCourse = result.data.newCourse;
        newCourse.teeboxes = result.data.newTeeboxes;
        this.props.setCourse(result.data.newCourse);
      }
      this.animateClose();
    })
  }

  addTeebox = teebox => {
    this.state.teeboxes.push(teebox);
  }

  updateTeebox = (idx, teebox) => {
    const updatedTeeboxes = [...this.state.teeboxes];
    updatedTeeboxes[idx] = teebox;
    this.setState({teeboxes: updatedTeeboxes});
  }

  deleteTeebox = idx => {
    const updatedTeeboxes = this.state.teeboxes;
    updatedTeeboxes.splice(idx, 1);
    this.setState({teeboxes: updatedTeeboxes});
  }

  touchTeeboxName = idx => {
    let touchedTeebox = this.state.teeboxes[idx];
    this.setState({currentTeebox: touchedTeebox, currentTeeboxIdx: idx, showTeebox: true});
  }

  findDuration = y => {
    const third = Dimensions.get('window').height / 2;
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
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const sd = this.state.scrollDimensions;
        const { moveX, moveY } = gestureState;
        if (!this.state.pendingTeeboxMoving
            && !this.state.showTeebox
            && !(moveX > sd.x
                && moveX < sd.x + sd.width
                && moveY > sd.y
                && moveY < sd.y + sd.height
            )
        ) {
          return Math.abs(gestureState.dy) >= threshold;
        }
      },
      onPanResponderMove: (e, gestureState) => {
        const { dy } = gestureState;
        if (dy >= 0) {
          this.state.slideAnim.setValue(dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy, x0, y0 } = gestureState;
        const sd = this.state.scrollDimensions;
        const closeSpeed = 0.85;
        const third = Dimensions.get('window').height / 3;
        if (dy >= third
          || (vy >= closeSpeed
            && !(x0 > sd.x
              && x0 < sd.x + sd.width
              && y0 > sd.y
              && y0 < sd.y + sd.height)
            )
        ) {
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
    let addTeebox = this.state.showAddTeebox
                  ? <AddTeebox
                      api={this.props.api}
                      user={this.props.user}
                      close={() => this.setState({showAddTeebox: false})}
                      addTeebox={this.addTeebox}
                    />
                  : '';
    let pendingTeeboxPage = this.state.showTeebox
                  ? <PendingTeebox
                      user={this.props.user}
                      teebox={this.state.currentTeebox}
                      teeboxIdx={this.state.currentTeeboxIdx}
                      close={() => this.setState({showTeebox: false})}
                      updatePendingTeeboxMoving={this.updatePendingTeeboxMoving}
                      updateTeebox={this.updateTeebox}
                      deleteTeebox={this.deleteTeebox}
                    />
                  : '';
    let teeboxes = this.state.teeboxes.map( (teebox, id) => {
      return (
        <TouchableHighlight onPress={() => this.touchTeeboxName(id)} style={styles.teeboxOuterWrap} underlayColor='rgb(102, 51, 153)' key={id}>
          <View style={styles.teeboxInnerWrap}>
            <WhiteText>{teebox.name}</WhiteText>
            <Icon
              name='chevron-right'
              type='font-awesome'
              size={20}
              color={yellow}
            />
          </View>
        </TouchableHighlight>
      );
    });
    let { slideAnim } = this.state;
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={ [styles.addCoursesWrapper, { transform: [{translateY: slideAnim}] }] }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.addCoursesView}>

            <WhiteText style={styles.pageTitle}>Add a course</WhiteText>

            <WhiteText>Course name</WhiteText>
            <TextInput
              returnKeyType='next'
              onSubmitEditing={() => this.notesInput.focus()}
              value={this.state.courseName}
              onChangeText={courseName => this.setState({courseName})}
              style={styles.textInput}
            />

            <View style={styles.addTeeboxWrap}>
              <WhiteText>Tee boxes</WhiteText>

              <TouchableOpacity onPress={() => this.setState({showAddTeebox: true})}>
                <View style={styles.addTeebox}>
                  <WhiteText style={ {fontSize: 15, marginRight: 10} }>Add</WhiteText>
                  <Icon color={offWhite} size={30} name='add-circle-outline' />
                </View>
              </TouchableOpacity>

            </View>

            <View
              onLayout={e => this.setState({scrollDimensions: e.nativeEvent.layout})}
              style={styles.teeboxScrollWrap}
            >
              <ScrollView ref='scroll' style={styles.teeboxScroll}>
                {teeboxes}
              </ScrollView>

              <View style={styles.iconWrap}>
                <Icon
                  name='chevron-up'
                  type='font-awesome'
                  size={15}
                  color={darkGrey}
                />
                <Icon
                  name='chevron-down'
                  type='font-awesome'
                  size={15}
                  color={darkGrey}
                />
              </View>

            </View>

            {addTeebox}

            {pendingTeeboxPage}

            <WhiteText>Notes</WhiteText>
            <TextInput
              ref={input => this.notesInput = input}
              value={this.state.notes}
              onChangeText={notes => this.setState({notes})}
              multiline={true}
              style={styles.textInput}
            />

            <TouchableOpacity style={styles.addCourseButton} onPress={this.addCourse} activeOpacity={.5}>
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

const { darkGrey, darkOffWhite, lightBlueDark, mediumGrey, offWhite, yellow } = colors;

const styles = StyleSheet.create({
  addCoursesWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightBlueDark,
    zIndex: 10
  },
  addCoursesView: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15
  },
  addCourseButton: {
    alignSelf: 'center',
    height: 50,
    width: '70%',
    marginTop: 20,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: yellow,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: .4,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0}
  },
  pageTitle: {
    marginBottom: 20,
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
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addTeebox: {
    marginRight: 15,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: yellow,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: .4,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0}
  },
  teeboxScroll: {
    height: 150,
    position: 'relative'
  },
  iconWrap: {
    height: 150,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 5,
    paddingRight: 5,
    // position: 'absolute',
    // right: 0,
    // alignSelf: 'flex-end',
    justifyContent: 'space-between',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: mediumGrey
  },
  teeboxScrollWrap: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: lightBlueDark,
    borderWidth: 10,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOpacity: .5,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 0},
  },
  teeboxOuterWrap: {
    width: '100%',
    alignItems: 'center'
  },
  teeboxInnerWrap: {
    width: '75%',
    marginBottom: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: darkOffWhite
  }
});
