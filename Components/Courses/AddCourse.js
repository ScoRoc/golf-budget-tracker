import React, { Component } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Keyboard,
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
import PendingTeebox from '../Teeboxes/PendingTeebox';

const slideTime = 500;

export default class AddCourse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      showAddTeebox: false,
      showTeebox: false,
      currentTeebox: '',
      currentTeeboxIdx: '',
      courseName: '',
      notes: '',
      teeboxes: []
    }
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

  animateClose = () => {
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: Dimensions.get('window').height,
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
                      updateTeebox={this.updateTeebox}
                      deleteTeebox={this.deleteTeebox}
                    />
                  : '';
    let teeboxes = this.state.teeboxes.map( (teebox, id) => {
      return (
        <TouchableHighlight onPress={() => this.touchTeeboxName(id)} underlayColor='rgb(102, 51, 153)' key={id}>
          <Text style={styles.teebox}>{teebox.name}</Text>
        </TouchableHighlight>
      );
    });
    let { slideAnim } = this.state;
    return (
      <Animated.View style={[
        styles.addCoursesWrapper,
        { transform: [ {translateY: slideAnim} ]}
      ]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.addCoursesView}>
          <Text onPress={this.animateClose}>~~~Close~~~</Text>

          <WhiteText style={styles.pageTitle}>Add a course</WhiteText>

          <WhiteText>Course name</WhiteText>
          <TextInput
            returnKeyType='next'
            onSubmitEditing={() => this.notesInput.focus()}
            value={this.state.courseName}
            onChangeText={courseName => this.setState({courseName})}
            style={styles.textInput}
          />

          <View style={styles.teeboxWrapper}>
            <View style={styles.addTeeboxWrap}>
              <WhiteText>Tee boxes</WhiteText>
              <TouchableHighlight onPress={() => this.setState({showAddTeebox: true})} underlayColor='rgb(102, 51, 153)'>
                <View style={styles.addTeebox}>
                  <Text style={ {marginRight: 10} }>Add</Text>
                  <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
                </View>
              </TouchableHighlight>
            </View>
            {teeboxes}
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

          <Button title='Add course' onPress={this.addCourse} />

        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const { lightBlueDark, mediumGrey, offWhite } = colors;

const styles = StyleSheet.create({
  addCoursesWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightBlueDark,
    zIndex: 10
  },
  addCoursesView: {
    ...StyleSheet.absoluteFillObject,
  },
  pageTitle: {
    fontSize: 26,
    textAlign: 'center'
  },
  textInput: {
    backgroundColor: mediumGrey,
    color: offWhite,
    fontSize: 16
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
