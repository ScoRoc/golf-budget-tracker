import React, { Component } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Keyboard,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Modal from 'react-native-modalbox'
import { Icon } from 'react-native-elements';
import axios from 'axios';
import DatePicker from '../DatePicker';
import AddCourse from '../Courses/AddCourse';

const slideTime = 700;

export default class AddRound extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').width),
      showDatePicker: false,
      showCoursePicker: false,
      showTeeboxPicker: false,
      showAddCourse: false,
      course: null,
      courseId: '',
      teebox: '',
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
    axios.post('http://localhost:3000/api/round', {  ///////// FIX URL
      course,
      teebox,
      date,
      score,
      price,
      notes,
      user: this.props.user
    }).then(result => {
      console.log('result.data.newRound: ', result.data.newRound);
      // this.props.getUserInfo();
      // if (this.props.setCourse) this.props.setCourse(this.state.courseName);
      this.animateClose();
    })
  }

  animateClose = () => {
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: Dimensions.get('window').width,
        duration: slideTime
      }
    ).start();
    setTimeout(this.props.close, slideTime);
  }

  componentDidMount() {
    this.props.getUserInfo();
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: 0,
        duration: slideTime
      }
    ).start();
  }

  render() {
    let addCourse = this.state.showAddCourse
                  ? <AddCourse
                      user={this.props.user}
                      close={() => this.setState({showAddCourse: false})}
                      getUserInfo={this.props.getUserInfo}
                      setCourse={this.setCourseFromAddCourse}
                    />
                  : '';
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
      <Animated.View style={[
        styles.addRoundsWrapper,
        { transform: [ {translateX: slideAnim} ]}
      ]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.addRoundsView}>
          <Text onPress={this.animateClose}>~~~Close~~~</Text>

          <View style={styles.selectCourseWrap}>
            <Text onPress={() => this.setState({showCoursePicker: true})}>{courseName}</Text>
            <TouchableHighlight onPress={() => this.setState({showAddCourse: true})} underlayColor='rgb(102, 51, 153)'>
              <View style={styles.addCourse}>
                <Text style={ {marginRight: 10} }>Add</Text>
                <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
              </View>
            </TouchableHighlight>
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

          <Text onPress={this.touchTeeboxName}>{teebox}</Text>
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

          <Text onPress={() => this.setState({showDatePicker: true})}>
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
          />

          <Text>Price</Text>
          <TextInput
            value={this.state.price}
            onChangeText={price => this.setState({price})}
            keyboardType='numeric'
            maxLength={3}
          />

          <Text>Notes</Text>
          <TextInput
            value={this.state.notes}
            onChangeText={notes => this.setState({notes})}
            multiline={true}
            style={{backgroundColor: 'red'}}
          />

          <Button title='Add round' onPress={this.addRound} />

        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  addRoundsWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'yellow'
  },
  addRoundsView: {
    ...StyleSheet.absoluteFillObject,
  },
  selectCourseWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addCourse: {
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