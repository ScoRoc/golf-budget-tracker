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
import Teebox from '../Teeboxes/Teebox';

export default class Course extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').width),
      teeboxMoving: false,
      showAddTeebox: false,
      showTeexbox: false,
      currentTeeboxIdx: '',
      course: null,
      name: '',
      notes: '',
      editable: false
    }
  }

  updateCourseLocalState = (teebox, idx, type) => {
    let updatedCourse = {...this.state.course};
    switch (type) {
      case 'add':
        updatedCourse.teeboxes.push(teebox);
        break;
      case 'edit':
        updatedCourse.teeboxes[idx] = teebox;
        break;
      case 'delete':
        updatedCourse.teeboxes.splice(idx, 1);
        break;
    }
    this.setState({updatedCourse});
  }

  editCourse = () => {
    axios.put(`${this.props.http}${this.props.api}/api/course`, {
      courseName: this.state.name,
      notes: this.state.notes,
      courseId: this.state.course._id
    }).then(result => {
      this.setState({editable: false});
      this.props.getUserInfo();
    })
  }

  deleteCourse = () => {
    axios({
      url: `${this.props.http}${this.props.api}/api/course`,
      method: 'delete',
      data: {courseId: this.state.course._id}
    }).then(result => {
      this.props.getUserInfo();
      this.animateClose();
    })
  }

  updateTeeboxMoving = bool => {
    this.setState({teeboxMoving: bool});
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
        if (!this.state.teeboxMoving) return Math.abs(gestureState.dx) >= threshold;
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
    const course = this.props.course;
    const time = 350;
    this.setState({
      course: course,
      name: course.courseName,
      notes: course.notes
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
    let { slideAnim } = this.state;
    let editSave = this.state.editable
                 ? <Text style={styles.editSave} onPress={this.editCourse}>Done</Text>
                 : <Text style={styles.editSave} onPress={() => this.setState({editable: true})}>Edit</Text>;
    let name = this.state.course ? this.state.course.courseName : '';
    let notes = this.state.course ? this.state.course.notes : '';
    let deleteCourse  = this.state.editable
                      ? <View style={styles.deleteWrap}>
                          <TouchableOpacity style={styles.deleteButton} onPress={this.deleteCourse} activeOpacity={.5}>
                            <Text style={styles.deleteText}>Delete course</Text>
                          </TouchableOpacity>
                        </View>
                      : '';
    const teeboxes  = this.state.course
                    ? this.state.course.teeboxes.map((teebox, idx) => {
                        return (
                          <TouchableHighlight
                             onPress={() => this.setState({ currentTeeboxIdx: idx, showTeebox: true })}
                             style={styles.teeboxOuterWrap}
                             underlayColor='rgb(102, 51, 153)'
                             key={idx}
                          >
                            <View style={styles.teeboxInnerWrap}>

                              <View style={styles.teeboxNameAndHDCPWrap}>
                                <View style={styles.teeboxHDCPBox}>
                                  <WhiteText style={ {fontSize: 10} }>HDCP</WhiteText>
                                  <WhiteText style={ {fontSize: 14} }>{teebox.teeboxHandicap}</WhiteText>
                                </View>

                                <WhiteText style={ {fontSize: 17} }>{teebox.name}</WhiteText>
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
                        )
                      })
                    : '';
    let teeboxPage  = this.state.showTeebox
                    ? <Teebox
                        api={this.props.api}
                        http={this.props.http}
                        user={this.props.user}
                        close={() => this.setState({showTeebox: false})}
                        updateTeeboxMoving={this.updateTeeboxMoving}
                        teebox={this.state.course.teeboxes[this.state.currentTeeboxIdx]}
                        teeboxIdx={this.state.currentTeeboxIdx}
                        updateCourse={this.updateCourseLocalState}
                        getUserInfo={this.props.getUserInfo}
                      />
                    : '';
    let addTeebox = this.state.showAddTeebox
                  ? <AddTeebox
                      api={this.props.api}
                      http={this.props.http}
                      user={this.props.user}
                      close={() => this.setState({showAddTeebox: false})}
                      course={this.state.course}
                      updateCourse={this.updateCourseLocalState}
                      getUserInfo={this.props.getUserInfo}
                    />
                  : '';
    let addTeeboxPlus = this.state.editable
                      ? <TouchableOpacity onPress={() => this.setState({showAddTeebox: true})}>
                          <View style={styles.addTeebox}>
                            <WhiteText style={ {fontSize: 15, marginRight: 10} }>Add</WhiteText>
                            <Icon color={offWhite} size={30} name='add-circle-outline' />
                          </View>
                        </TouchableOpacity>
                      : '';
    const editable = this.state.editable ? styles.editable : '';
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={ [styles.courseWrapper, { transform: [{translateX: slideAnim}] }] }
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

            <ScrollView style={styles.courseScrollView} contentContainerStyle={ {flexGrow: 1} }>
            {/* <ScrollView style={styles.courseScrollView} stickyHeaderIndices={[0]} contentContainerStyle={ {flexGrow: 1} }> */}

              <TextInput
                style={ [styles.courseName, editable] }
                placeholder='Course name'
                multiline={true}
                editable={this.state.editable}
                value={name}
                onChangeText={text => this.setState({name: text})}
              />

              <View style={styles.addTeeboxWrap}>
                <WhiteText style={styles.sectionTitle}>Tee Boxes</WhiteText>
                {addTeeboxPlus}
              </View>

              {teeboxes}

              <WhiteText style={styles.sectionTitle}>Notes</WhiteText>
              <TextInput
                style={ [styles.notes, editable] }
                placeholder='Notes...'
                editable={this.state.editable}
                value={notes}
                onChangeText={text => this.setState({notes: text})}
              />

              {deleteCourse}

              {/* filler for space */}
              <View style={ {height: 100} }></View>

            </ScrollView>

            {teeboxPage}
            {addTeebox}

          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const { darkOffWhite, darkOffWhiteTrans, darkSeafoam, lightBlue, lightBlueDark, lightOrange, mediumGrey, offWhite, redGrey, yellow } = colors;

const styles = StyleSheet.create({
  courseWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightBlueDark,
  },
  topBarView: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: lightBlue,
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
  courseScrollView: {
    minHeight: '100%',
    padding: 15,
    paddingTop: 0
  },
  courseName: {
    marginTop: 15,
    marginBottom: 15,
    color: offWhite,
    fontSize: 38,
    flexWrap: 'wrap',
    textAlign: 'center'
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 15,
    fontSize: 17,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  notes: {
    marginBottom: 20,
    color: offWhite,
    fontSize: 16,
  },
  editable: {
    backgroundColor: mediumGrey
  },
  addTeeboxWrap: {
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
  teeboxOuterWrap: {
    width: '100%',
    alignItems: 'center'
  },
  teeboxInnerWrap: {
    width: '90%',
    marginBottom: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: darkOffWhite
  },
  teeboxNameAndHDCPWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  teeboxHDCPBox: {
    height: 45,
    width: 45,
    marginRight: 10,
    padding: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: lightOrange,
    borderRadius: 5
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
