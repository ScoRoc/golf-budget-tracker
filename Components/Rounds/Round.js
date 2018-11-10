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
      roundId: '',
      course: null,
      courseId: '',
      teebox: null,
      teeboxId: '',
      date: new Date(),
      score: '',
      teamScore: false,
      price: '',
      notes: ''
    }
  }

  editRound = () => {
    const { roundId, course, teebox, date, teamScore, notes } = this.state;
    const score = parseInt(this.state.score);
    const price = parseInt(this.state.price);
    axios.put(`${this.props.http}${this.props.api}/api/round`, {
      roundId,
      course,
      teebox,
      date,
      score,
      teamScore,
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
      url: `${this.props.http}${this.props.api}/api/round`,
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

  updateTeamScore = () => {
    if (this.state.editable) {
      this.setState({teamScore: !this.state.teamScore});
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
        const { showDatePicker, showCoursePicker, showTeeboxPicker } = this.state;
        if (!showDatePicker && !showCoursePicker && !showTeeboxPicker) return Math.abs(gestureState.dx) >= threshold;
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
    let { teamScore, notes } = this.props.round;
    let date = new Date(this.props.round.date);
    let score = this.props.round.score.toString();
    let price = this.props.round.price ? this.props.round.price.toString() : '';
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
      teamScore,
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
    let deleteRound  = this.state.editable
                      ? <View style={styles.deleteWrap}>
                          <TouchableOpacity style={styles.deleteButton} onPress={this.deleteRound} activeOpacity={.5}>
                            <Text style={styles.deleteText}>Delete round</Text>
                          </TouchableOpacity>
                        </View>
                      : '';
    let { slideAnim } = this.state;
    let courseName = this.state.course ? this.state.course.courseName : 'Select a course...';
    let teebox = this.state.teebox ? this.state.teebox.name : 'Pick a course to choose a teebox...';
    const editable = this.state.editable ? styles.editable : '';
    const color = this.state.teamScore ? styles.team : styles.solo;
    let teamScore = this.state.teamScore ? 'Team' : 'Solo';
    let underlay = this.state.editable ? 'rgb(102, 51, 153)' : 'rgba(102, 51, 153, 0)';
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

              <View style={styles.scoreCourseTeeboxWrap}>

                <View style={styles.scoreOuterWrap}>
                  <View style={ [styles.scoreWrap, color] }>
                    <WhiteText style={ {fontSize: 14} }>Score</WhiteText>
                    <TextInput
                      style={ [styles.score, editable] }
                      value={this.state.score}
                      onChangeText={score => this.setState({score})}
                      keyboardType='numeric'
                      maxLength={3}
                      editable={this.state.editable}
                    />
                  </View>
                  <TouchableHighlight onPress={this.updateTeamScore} underlayColor={underlay}>
                    <WhiteText style={editable}>{teamScore}</WhiteText>
                  </TouchableHighlight>
                </View>

                <View style={ [styles.courseTeeboxWrap, color] }>
                  <View style={styles.courseNameView}>
                    <WhiteText style={ [{fontSize: 24}, editable] } onPress={() => this.openModal('showCoursePicker')}>{courseName}</WhiteText>
                  </View>
                  <WhiteText style={editable} onPress={this.touchTeeboxName}>{teebox}</WhiteText>
                </View>

              </View>

              <Modal
                style={styles.modal}
                isOpen={this.state.showCoursePicker}
                backdropPressToClose={true}
                position='bottom'
                backdrop={true}
                animationDuration={350}
                onClosed={() => this.setState({showCoursePicker: false})}
                >
                  <Picker selectedValue={this.state.courseId} onValueChange={(courseId, idx) => this.handleCoursePicker(courseId, idx)}>
                    <Picker.Item label='Please select a course...' value='pick' />
                    {courses}
                  </Picker>
              </Modal>

              <Modal
                style={styles.modal}
                isOpen={this.state.showTeeboxPicker}
                backdropPressToClose={true}
                position='bottom'
                backdrop={true}
                animationDuration={350}
                onClosed={() => this.setState({showTeeboxPicker: false})}
                >
                  <Picker selectedValue={this.state.teeboxId} onValueChange={(teeboxId, idx) => this.handleTeeboxPicker(teeboxId, idx)}>
                    <Picker.Item label='Please select a course...' value='pick' />
                    {teeboxes}
                  </Picker>
              </Modal>

              <View style={ [styles.dateView, color] }>
                <Icon
                  name='calendar'
                  type='font-awesome'
                  size={20}
                  color={offWhite}
                />
                <WhiteText style={ [styles.date, editable] } onPress={() => this.openModal('showDatePicker')}>
                  {this.state.date.toDateString()} {this.state.date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </WhiteText>
              </View>
              <Modal
                style={styles.modal}
                isOpen={this.state.showDatePicker}
                backdropPressToClose={true}
                position='bottom'
                backdrop={true}
                animationDuration={350}
                onClosed={() => this.setState({showDatePicker: false})}
                >
                  <DatePicker date={this.state.date} setDate={date => this.setState({date})} />
              </Modal>

              <WhiteText style={styles.sectionTitle}>Price</WhiteText>
              <View style={ {flexDirection: 'row', marginBottom: 20} }>
                <WhiteText>$</WhiteText>
                <TextInput
                  style={ [styles.price, editable] }
                  placeholder='000'
                  value={this.state.price}
                  onChangeText={price => this.setState({price})}
                  keyboardType='numeric'
                  maxLength={3}
                  editable={this.state.editable}
                />
              </View>

              <WhiteText style={styles.sectionTitle}>Notes</WhiteText>
              <TextInput
                style={ [styles.notes, editable] }
                placeholder='Notes...'
                value={this.state.notes}
                onChangeText={notes => this.setState({notes})}
                multiline={true}
                editable={this.state.editable}
              />

              {deleteRound}

            </View>

          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const { darkOffWhite, darkOffWhiteTrans, darkSeafoam, lightPurple, mediumGrey, offWhite, purple, redGrey, steelBlue, yellow } = colors;

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
    backgroundColor: lightPurple,
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
  editable: {
    backgroundColor: mediumGrey
  },
  solo: {
    backgroundColor: darkSeafoam
  },
  team: {
    backgroundColor: steelBlue
  },
  scoreCourseTeeboxWrap: {
    marginTop: 40,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scoreOuterWrap: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scoreWrap: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  score: {
    color: offWhite,
    fontSize: 38
  },
  courseTeeboxWrap: {
    minHeight: '10%',
    width: '70%',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  courseNameView: {
    marginBottom: 15,
    borderBottomColor: darkOffWhite,
    borderBottomWidth: 1
  },
  dateView: {
    marginBottom: 30,
    padding: 10,
    paddingLeft: 15,
    flexDirection: 'row',
    borderRadius: 8,
  },
  date: {
    marginLeft: 15,
    fontSize: 18
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 15,
    fontSize: 17,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  price: {
    marginLeft: 5,
    color: offWhite,
    fontSize: 16,
  },
  notes: {
    marginBottom: 20,
    color: offWhite,
    fontSize: 16,
  },
  modal: {
    height: '45%',
    paddingTop: '5%'
  },
  deleteWrap: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center'
  },
  deleteButton: {
    width: '75%',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: redGrey,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkOffWhite,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: .3,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0}
  },
  deleteText: {
    color: yellow,
    fontSize: 25,
    textAlign: 'center'
  }
});
