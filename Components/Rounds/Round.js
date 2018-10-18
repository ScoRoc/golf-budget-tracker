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
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Modal from 'react-native-modalbox';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { colors } from '../../global_styles/colors';
import WhiteText from '../Text/WhiteText';
import DatePicker from '../DatePicker';
import AddCourse from '../Courses/AddCourse';

export default class Round extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').width),
      editable: false,
      showDatePicker: false,
      showCoursePicker: false,
      showTeeboxPicker: false,
      showAddCourse: false,
      roundId: '',
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

  editRound = () => {
    const { roundId, course, teebox, date, notes } = this.state;
    const score = parseInt(this.state.score);
    const price = parseInt(this.state.price);
    axios.put(`http://${this.props.api}/api/round`, {  ///////// FIX URL
      roundId,
      course,
      teebox,
      date,
      score,
      price,
      notes,
      user: this.props.user
    }).then(result => {
      this.props.getUserInfo();
      this.setState({editable: false});
    });
  }

  deleteRound = () => {
    axios({
      url: `http://${this.props.api}/api/round`,  /////// FIX URL
      method: 'delete',
      data: {roundId: this.state.roundId, teeboxId: this.state.teeboxId, user: this.props.user}
    }).then(result => {
      this.props.getUserInfo();
      this.animateClose();
    });
  }

  setCourseFromAddCourse = course => {
    this.setState({course, courseId: course._id});
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
    if (this.state.course && this.state.editable) {
      this.setState({showTeeboxPicker: true});
    }
  }

  openModal = modal => {
    if (this.state.editable) {
      this.setState({[modal]: true});
    }
  }

  findDuration = x => {
    const half = Dimensions.get('window').width / 2;
    let time = 0;
    switch (true) {
      case x < half * .25:
        time = 50;
        break;
      case x >= half * .25 && x < half * .5:
        time = 100;
        break;
      case x >= half * .5 && x < half * .75:
        time = 150;
        break;
      case x >= half * .75:
        time = 200;
        break;
      default:
        time = 250;
    }
    return time;
  }

  animateReset = x => {
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: 0,
        duration: this.findDuration(x)
      }
    ).start();
  }

  animateClose = x => {
    const time = this.findDuration(x);
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: Dimensions.get('window').width,
        duration: time
      }
    ).start();
    setTimeout(this.props.close, time);
  }

  componentWillMount() {
    const threshold = 8;
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const { showDatePicker, showCoursePicker, showTeeboxPicker, showAddCourse } = this.state;
        if (!showDatePicker && !showCoursePicker && !showTeeboxPicker && !showAddCourse) return Math.abs(gestureState.dx) >= threshold;
      },
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.x0 <= 30 && gestureState.x0 >= 0) {
          this.state.slideAnim.setValue(gestureState.moveX);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx, x0, moveX } = gestureState;
        const closeSpeed = 0.85;
        const half = Dimensions.get('window').width / 2;
        if (x0 <= 30 && vx >= closeSpeed || dx >= half) {
          this.animateClose(moveX);
        } else {
          this.animateReset(moveX);
        }
        return false;
      }
    })
  }

  componentDidMount() {
    const time = 350;
    let { notes } = this.props.round;
    let date = new Date(this.props.round.date);
    let score = this.props.round.score.toString();
    let price = this.props.round.price.toString();
    let course = 'No course selected';
    let teebox = 'No teebox selected';
    this.props.courses.forEach(oneCourse => {
      if (oneCourse._id === this.props.round.courseId) {
        course = oneCourse;
        oneCourse.teeboxes.forEach(oneTeebox => {
          if (oneTeebox._id === this.props.round.teeboxId) {
            teebox = oneTeebox;
          }
        });
      }
    });
    this.setState({
      roundId: this.props.round._id,
      course,
      courseId: course._id,
      teebox,
      teeboxId: teebox._id,
      date,
      score,
      price,
      notes
    });
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
                      user={this.props.user}
                      close={() => this.setState({showAddCourse: false})}
                      getUserInfo={this.props.getUserInfo}
                      setCourse={this.setCourseFromAddCourse}
                    />
                  : '';
    let addCoursePlus = this.state.editable
                      ? <TouchableHighlight onPress={() => this.setState({showAddCourse: true})} underlayColor='rgb(102, 51, 153)'>
                          <View style={styles.addButton}>
                            <Text style={ {marginRight: 10} }>Add</Text>
                            <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
                          </View>
                        </TouchableHighlight>
                      : '';
    let editSave = this.state.editable
                 ? <Text style={styles.editSave} onPress={this.editRound}>Done</Text>
                 : <Text style={styles.editSave} onPress={() => this.setState({editable: true})}>Edit</Text>;
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
    let deleteRound = this.state.editable ? <Button title='Delete round' onPress={this.deleteRound}  /> : '';
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={ [styles.roundWrapper, { transform: [{translateX: slideAnim}] }] }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>

            <View style={styles.topBarView}>
              <TouchableWithoutFeedback onPress={this.animateClose}>
                <Icon
                  name='chevron-left'
                  type='font-awesome'
                  size={20}
                  color={colors.yellow}
                  iconStyle={ {marginLeft: 0} }
                />
              </TouchableWithoutFeedback>
              {editSave}
            </View>

            <View style={styles.addRoundBodyView}>

              <View style={styles.selectAndAddWrap}>
                <Text onPress={() => this.openModal('showCoursePicker')}>{courseName}</Text>
                {addCoursePlus}
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

              <View style={styles.selectAndAddWrap}>
                <Text onPress={this.touchTeeboxName}>{teebox}</Text>
                {/* <TouchableHighlight onPress={() => this.setState({showAddTeebox: true})} underlayColor='rgb(102, 51, 153)'>
                  <View style={styles.addButton}>
                    <Text style={ {marginRight: 10} }>Add</Text>
                    <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
                  </View>
                </TouchableHighlight> */}
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

              <Text onPress={() => this.openModal('showDatePicker')}>
                {this.state.date.toDateString()} {this.state.date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </Text>
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

              <Text>Score</Text>
              <TextInput
                value={this.state.score}
                onChangeText={score => this.setState({score})}
                keyboardType='numeric'
                maxLength={3}
                editable={this.state.editable}
              />

              <Text>Price</Text>
              <TextInput
                value={this.state.price}
                onChangeText={price => this.setState({price})}
                keyboardType='numeric'
                maxLength={3}
                editable={this.state.editable}
              />

              <Text>Notes</Text>
              <TextInput
                value={this.state.notes}
                onChangeText={notes => this.setState({notes})}
                multiline={true}
                editable={this.state.editable}
                style={{backgroundColor: 'red'}}
              />

              {deleteRound}

            </View>

          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const { darkOffWhiteTrans, purple, yellow } = colors;

const styles = StyleSheet.create({
  roundWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: purple,
    zIndex: 30
  },
  topBarView: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: purple,
    borderBottomWidth: 1,
    borderBottomColor: darkOffWhiteTrans
  },
  editSave: {
    paddingLeft: 10,
    paddingRight: 10,
    color: yellow,
    fontSize: 18,
    fontWeight: 'bold'
  },
  addRoundBodyView: {
    minHeight: '100%',
    padding: 15,
    paddingTop: 0
  },
  selectAndAddWrap: {
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
  modal: {
    paddingTop: '5%',
    height: '40%'
  }
});
