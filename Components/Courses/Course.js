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
    axios.put(`http://${this.props.api}/api/course`, {  /////// FIX URL
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
      url: `http://${this.props.api}/api/course`,  /////// FIX URL
      method: 'delete',
      data: {courseId: this.state.course._id}
    }).then(result => {
      this.props.getUserInfo();
      this.animateClose();
    })
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
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        return Math.abs(gestureState.dx) >= 1;
      },
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.x0 <= 30 && gestureState.x0 >= 0) {
          this.state.slideAnim.setValue(gestureState.moveX);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx, x0 } = gestureState;
        const closeSpeed = 0.85;
        const half = Dimensions.get('window').width / 2;
        if (x0 <= 30 && vx >= closeSpeed || dx >= half) {
          this.animateClose(gestureState.moveX);
        } else {
          this.animateReset(gestureState.moveX);
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
    let deleteCourse = this.state.editable ? <Button title='Delete course' onPress={this.deleteCourse}  /> : '';
    const teeboxes = this.state.course
                   ? this.state.course.teeboxes.map((teebox, idx) => {
                       return (
                         <TouchableHighlight onPress={() => this.setState({ currentTeeboxIdx: idx, showTeebox: true })} underlayColor='rgb(102, 51, 153)' key={idx}>
                           <Text style={styles.teebox}>{teebox.name} --- teebox handicap: {teebox.teeboxHandicap}</Text>
                         </TouchableHighlight>
                       )
                     })
                   : '';
    let teeboxPage  = this.state.showTeebox
                    ? <Teebox
                        api={this.props.api}
                        user={this.props.user}
                        close={() => this.setState({showTeebox: false})}
                        teebox={this.state.course.teeboxes[this.state.currentTeeboxIdx]}
                        teeboxIdx={this.state.currentTeeboxIdx}
                        updateCourse={this.updateCourseLocalState}
                        getUserInfo={this.props.getUserInfo}
                      />
                    : '';
    let addTeebox = this.state.showAddTeebox
                  ? <AddTeebox
                      api={this.props.api}
                      user={this.props.user}
                      close={() => this.setState({showAddTeebox: false})}
                      course={this.state.course}
                      updateCourse={this.updateCourseLocalState}
                      getUserInfo={this.props.getUserInfo}
                    />
                  : '';
    let addTeeboxPlus = this.state.editable
                      ? <TouchableHighlight onPress={() => this.setState({showAddTeebox: true})} underlayColor='rgb(102, 51, 153)'>
                          <View style={styles.addTeebox}>
                            <Text style={ {marginRight: 10} }>Add</Text>
                            <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
                          </View>
                        </TouchableHighlight>
                      : '';
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[
        styles.courseWrapper,
        { transform: [ {translateX: slideAnim} ]}
      ]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.courseMainView}>

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

            <WhiteText>Course name:</WhiteText>
            <TextInput
              editable={this.state.editable}
              value={name}
              onChangeText={text => this.setState({name: text})}
            />

            <Text>Notes:</Text>
            <TextInput
              editable={this.state.editable}
              value={notes}
              onChangeText={text => this.setState({notes: text})}
            />

            <View style={styles.addTeeboxWrap}>
              <Text>Tee Boxes</Text>
              {addTeeboxPlus}
            </View>

            {teeboxes}
            {teeboxPage}

            {addTeebox}

            {deleteCourse}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const { darkOffWhite, darkOffWhiteTrans, lightBlueDark, yellow } = colors;

const styles = StyleSheet.create({
  courseWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightBlueDark,
  },
  courseMainView: {
    ...StyleSheet.absoluteFillObject,
    padding: 15,
  },
  topBarView: {
    marginBottom: 30,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: darkOffWhiteTrans
  },
  editSave: {
    color: yellow,
    fontSize: 18
  },
  teebox: {
    marginBottom: 3,
    color: 'rgb(195, 58, 161)'
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
});
