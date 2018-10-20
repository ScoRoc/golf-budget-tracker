import React, { Component } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Keyboard,
  PanResponder,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modalbox';
import { Icon } from 'react-native-elements';
import { colors } from '../../global_styles/colors';
import WhiteText from '../Text/WhiteText';
import DatePicker from '../DatePicker';
import AddCourse from '../Courses/AddCourse';
import AddTeebox from '../Teeboxes/AddTeebox';

export default class AddRound extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      showDatePicker: false,
      showCoursePicker: false,
      showTeeboxPicker: false,
      showAddCourse: false,
      showAddTeebox: false,
      course: null,
      courseId: '',
      teebox: null,
      teeboxId: '',
      date: new Date(),
      score: '',
      price: '',
      notes: ''
    }
  }

  setCourseFromAddCourse = course => {
    this.setState({course});
  }

  setTeeboxFromAddTeebox = teebox => {
    this.setState({teebox});
  }

  handleCoursePicker = (courseId, idx) => {
    const course = this.props.courses.filter(course => {
      return course._id === courseId;
    });
    if (idx !== 0) {
      this.setState({course: course[0], courseId, teebox: '', teeboxId: ''});
    }
  }

  handleTeeboxPicker = (teeboxId, idx) => {
    const teebox = this.state.course.teeboxes.filter(teebox => {
      return teebox._id === teeboxId;
    });
    if (idx !== 0) {
      this.setState({teebox: teebox[0], teeboxId});
    }
  }

  touchTeeboxName = () => {
    if (this.state.course) {
      this.setState({showTeeboxPicker: true});
    }
  }

  addRound = () => {
    const { course, teebox, date, notes } = this.state;
    const score = parseInt(this.state.score);
    const price = parseInt(this.state.price);
    axios.post(`${this.props.http}${this.props.api}/api/round`, {
      course,
      teebox,
      date,
      score,
      price,
      notes,
      user: this.props.user
    }).then(result => {
      this.props.getUserInfo();
      if (this.props.setCourse) this.props.setCourse(this.state.courseName);
      this.animateClose();
    })
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
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const { showDatePicker, showCoursePicker, showTeeboxPicker, showAddCourse, showAddTeebox } = this.state;
        if (!showDatePicker
            && !showCoursePicker
            && !showTeeboxPicker
            && !showAddCourse
            && !showAddTeebox
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
      onPanResponderRelease: (e, gestureState) => {
        const { dy, vy, y0 } = gestureState;
        const closeSpeed = 0.85;
        const third = Dimensions.get('window').height / 3;
        if (dy >= third || vy >= closeSpeed) {
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
    this.props.getUserInfo();
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: 0,
        duration: time
      }
    ).start();
  }

  render() {
    let addCourse = this.state.showAddCourse
                  ? <AddCourse
                      api={this.props.api}
                      http={this.props.http}
                      user={this.props.user}
                      close={() => this.setState({showAddCourse: false})}
                      getUserInfo={this.props.getUserInfo}
                      setCourse={this.setCourseFromAddCourse}
                    />
                  : '';
    // let addTeebox = this.state.showAddTeebox
    //               ? <AddTeebox
    //                   user={this.props.user}
    //                   close={() => this.setState({showAddTeebox: false})}
    //                   course={this.state.course}
    //                   updateCourse={this.updateCourseLocalState}
    //                   getUserInfo={this.props.getUserInfo}
    //                 />
    //               : '';
    let courses = this.props.courses.map((course, idx) => {
      return <Picker.Item label={course.courseName} value={course._id} key={idx} />
    });
    let teeboxes = this.state.course
                 ? this.state.course.teeboxes.map((teebox, idx) => {
                     return <Picker.Item label={teebox.name} value={teebox._id} key={idx} />
                   })
                 : '';
    let { slideAnim } = this.state;
    let courseName = this.state.course ? this.state.course.courseName : 'Select a course...';
    let teebox = this.state.teebox ? this.state.teebox.name : 'Pick a course to choose a teebox...';
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={ [styles.addRoundsWrapper, { transform: [{translateY: slideAnim}] }] }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.addRoundsView}>

            <View style={styles.courseWrap}>

              <View style={styles.courseNameView}>
                <WhiteText onPress={() => this.setState({showCoursePicker: true})}>{courseName}</WhiteText>
              </View>

              <TouchableOpacity onPress={() => this.setState({showAddCourse: true})}>
                <View style={styles.addCourse}>
                  <WhiteText style={ {fontSize: 15, marginRight: 10} }>Add</WhiteText>
                  <Icon color={offWhite} size={30} name='add-circle-outline' />
                </View>
              </TouchableOpacity>

            </View>

            <Modal
              style={styles.modal}
              isOpen={this.state.showCoursePicker}
              backdropPressToClose={true}
              position='bottom'
              backdrop={true}
              animationDuration={500}
              onClosed={() => this.setState({showCoursePicker: false})}
              >
                <Picker selectedValue={this.state.courseId} onValueChange={(courseId, idx) => this.handleCoursePicker(courseId, idx)}>
                  <Picker.Item label='Please select a course...' value='pick' />
                  {courses}
                </Picker>
            </Modal>
            {addCourse}

            <View style={styles.teeboxView}>
              <WhiteText onPress={this.touchTeeboxName}>{teebox}</WhiteText>
            </View>

            <Modal
              style={styles.modal}
              isOpen={this.state.showTeeboxPicker}
              backdropPressToClose={true}
              position='bottom'
              backdrop={true}
              animationDuration={500}
              onClosed={() => this.setState({showTeeboxPicker: false})}
              >
                <Picker selectedValue={this.state.teeboxId} onValueChange={(teeboxId, idx) => this.handleTeeboxPicker(teeboxId, idx)}>
                  <Picker.Item label='Please select a course...' value='pick' />
                  {teeboxes}
                </Picker>
            </Modal>
            {/* {addTeebox} */}

            <View style={styles.dateView}>
              <Icon
                name='calendar'
                type='font-awesome'
                size={20}
                color={offWhite}
              />
              <WhiteText style={styles.date} onPress={() => this.setState({showDatePicker: true})}>
                {this.state.date.toDateString()} {this.state.date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </WhiteText>
            </View>

            <Modal
              style={styles.modal}
              isOpen={this.state.showDatePicker}
              backdropPressToClose={true}
              position='bottom'
              backdrop={true}
              animationDuration={500}
              onClosed={() => this.setState({showDatePicker: false})}
              >
                <DatePicker date={this.state.date} setDate={date => this.setState({date})} />
            </Modal>

            <WhiteText>Score</WhiteText>
            <TextInput
              style={styles.textInput}
              value={this.state.score}
              onChangeText={score => this.setState({score})}
              keyboardType='numeric'
              maxLength={3}
            />

            <WhiteText>Price</WhiteText>
            <TextInput
              style={styles.textInput}
              value={this.state.price}
              onChangeText={price => this.setState({price})}
              keyboardType='numeric'
              maxLength={3}
            />

            <WhiteText>Notes</WhiteText>
            <TextInput
              style={styles.textInput}
              value={this.state.notes}
              onChangeText={notes => this.setState({notes})}
              multiline={true}
            />

            <TouchableOpacity style={styles.addRoundButton} onPress={this.addRound} activeOpacity={.5}>
              <WhiteText style={ {fontSize: 20, fontWeight: 'bold'} }>Add round</WhiteText>
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

const { mediumGrey, offWhite, purple, yellow } = colors;

const styles = StyleSheet.create({
  addRoundsWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: purple
  },
  addRoundsView: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15
  },
  courseWrap: {
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30
  },
  courseNameView: {
    width: '70%',
    padding: 5,
    paddingLeft: 15,
    backgroundColor: mediumGrey,
    borderRadius: 8,
  },
  addCourse: {
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
  teeboxView: {
    marginBottom: 25,
    padding: 5,
    paddingLeft: 15,
    backgroundColor: mediumGrey,
    borderRadius: 8,
  },
  dateView: {
    marginBottom: 25,
    padding: 5,
    paddingLeft: 15,
    flexDirection: 'row',
    backgroundColor: mediumGrey,
    borderRadius: 8,
  },
  date: {
    marginLeft: 15,
    fontSize: 18
  },
  modal: {
    paddingTop: '5%',
    height: '40%'
  },
  textInput: {
    marginBottom: 25,
    backgroundColor: mediumGrey,
    color: offWhite,
    fontSize: 16
  },
  addRoundButton: {
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
  }
});
