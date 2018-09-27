import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  Picker,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native';
import Modal from 'react-native-modalbox'
import { Icon } from 'react-native-elements';
import DatePicker from '../DatePicker';
import AddCourse from '../Courses/AddCourse';

const slideTime = 700;

export default class AddMatch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').width),
      showDatePicker: false,
      showCoursePicker: false,
      showAddCourse: false,
      date: new Date(),
      course: '',
      score: '',
      price: '',
      notes: ''
    }
  }

  setCourseFromAddCourse = course => {
    this.setState({course});
  }

  handleCoursePicker = (course, idx) => {
    if (idx !== 0) {
      this.setState({course})
    }
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
                      getCourses={this.props.getCourses}
                      setCourse={this.setCourseFromAddCourse}
                    />
                  : '';
    let { slideAnim } = this.state;
    let courseName = this.state.course ? this.state.course : 'Select a course...';
    return (
      <Animated.View style={[
        styles.addMatchesWrapper,
        { transform: [ {translateX: slideAnim} ]}
      ]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.addMatchesView}>
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
              <Picker selectedValue={this.state.course} onValueChange={(course, idx) => this.handleCoursePicker(course, idx)}>
                <Picker.Item label='Please select a course...' value='pick' />
                <Picker.Item label='one' value='one' />
                <Picker.Item label='two' value='two' />
              </Picker>
          </Modal>
          {addCourse}

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
        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  addMatchesWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'yellow'
  },
  addMatchesView: {
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
