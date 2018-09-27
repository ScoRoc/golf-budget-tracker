import React, { Component } from 'react';
import { StyleSheet, Dimensions, Animated, DatePickerIOS, Keyboard, TouchableWithoutFeedback, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modalbox'
import DatePicker from './DatePicker';
import { Icon } from 'react-native-elements';

const slideTime = 700;

export default class AddMatch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').width),
      showModal: false,
      date: new Date(),
      score: '0'
    }
  }

  flipModal = bool => {
    this.setState( {showModal: bool} )
  }

  setDate = newDate => {
    this.setState( {date: newDate} );
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
    let { slideAnim } = this.state;
    return (
      <Animated.View style={[
        styles.addMatchesWrapper,
        { transform: [ {translateX: slideAnim} ]}
      ]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.addMatchesView}>
          <Text onPress={this.animateClose}>~~~Close~~~</Text>
          <Text>CourseName</Text>
          <Text onPress={() => this.flipModal(true)}>
            {this.state.date.toDateString()} {this.state.date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </Text>
          <Modal
            style={styles.modal}
            isOpen={this.state.showModal}
            backdropPressToClose={true}
            position='bottom'
            backdrop={true}
            animationDuration={500}
            onClosed={() => this.flipModal(false)}
            >
              <DatePicker date={this.state.date} setDate={this.setDate} />
          </Modal>
          <Text>Score</Text>
          <TextInput
            value={this.state.score}
            onChangeText={score => this.setState({score})}
            keyboardType='numeric'
            maxLength={3}
          />
          <Text>Price</Text>
          <Text>Notes_____________</Text>
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
  modal: {
    paddingTop: '5%',
    height: '40%'
  }
});
