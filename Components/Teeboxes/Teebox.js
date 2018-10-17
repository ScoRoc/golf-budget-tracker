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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { colors } from '../../global_styles/colors';
import WhiteText from '../Text/WhiteText';

export default class Teebox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').width),
      editable: false,
      name: '',
      rating: '',
      slope: ''
    }
  }

  editTeebox = () => {
    let { name } = this.state;
    let rating = parseFloat(this.state.rating);
    let slope = parseInt(this.state.slope);
    axios.put(`http://${this.props.api}/api/teebox`, {  /////// FIX URL
      name,
      rating,
      slope,
      id: this.props.teebox._id
    }).then(result => {
      this.props.updateCourse(result.data.updatedTeebox, this.props.teeboxIdx, 'edit');
      this.props.getUserInfo();
      this.setState({editable: false});
    });
  }

  deleteTeebox = () => {
    axios({
      url: `http://${this.props.api}/api/teebox`,  /////// FIX URL
      method: 'delete',
      data: {id: this.props.teebox._id}
    }).then(result => {
      this.props.updateCourse(null, this.props.teeboxIdx, 'delete');
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
    this.props.updateTeeboxMoving(false);
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
    this.props.updateTeeboxMoving(false);
    setTimeout(this.props.close, time);
  }

  componentWillMount() {
    const threshold = 8;
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (Math.abs(gestureState.dx) >= threshold) {
          this.props.updateTeeboxMoving(true);
          return true;
        } else {
          return false;
        }
      },
      onPanResponderMove: (e, gestureState) => {
        const { dx } = gestureState;
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
    this.setState({
      name: this.props.teebox.name,
      rating: this.props.teebox.rating.toString(),
      slope: this.props.teebox.slope.toString()
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
                 ? <Text style={styles.editSave} onPress={this.editTeebox}>Done</Text>
                 : <Text style={styles.editSave} onPress={() => this.setState({editable: true})}>Edit</Text>;
    let name = this.state.name ? this.state.name : '';
    let rating = this.state.rating ? this.state.rating : '';
    let slope = this.state.slope ? this.state.slope : '';
    let deleteTeebox  = this.state.editable
                      ? <View style={styles.deleteWrap}>
                          <TouchableOpacity style={styles.deleteButton} onPress={this.deleteTeebox} activeOpacity={.5}>
                            <Text style={styles.deleteText}>Delete teebox</Text>
                          </TouchableOpacity>
                        </View>
                      : '';
    const editable = this.state.editable ? styles.editable : '';
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={ [styles.teeboxWrapper, { transform: [{translateX: slideAnim}] }] }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.teeboxMainView}>

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

            <View style={styles.teeboxBodyView}>

              <TextInput
                style={ [styles.teeboxName, editable] }
                placeholder='Course name'
                multiline={true}
                editable={this.state.editable}
                value={name}
                onChangeText={name => this.setState({name})}
              />

              <View style={styles.detailsWrap}>

                <View style={styles.titleSection}>
                  <WhiteText style={styles.title}>Rating</WhiteText>
                  <WhiteText style={styles.title}>Slope</WhiteText>
                </View>

                <View style={styles.details}>
                  <TextInput
                    style={ [styles.ratingSlope, editable] }
                    placeholder='Rating'
                    editable={this.state.editable}
                    value={rating}
                    onChangeText={rating => this.setState({rating})}
                    keyboardType='numeric'
                    maxLength={4}
                  />
                  <TextInput
                    style={ [styles.ratingSlope, editable] }
                    placeholder='Slope'
                    editable={this.state.editable}
                    value={slope}
                    onChangeText={slope => this.setState({slope})}
                    keyboardType='numeric'
                    maxLength={3}
                  />
                </View>

              </View>

              {deleteTeebox}
            </View>

          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const { lightBlue, lightBlueDark, lightOrange, darkOffWhite, darkOffWhiteTrans, mediumGrey, offWhite, redGrey, yellow } = colors;

const styles = StyleSheet.create({
  teeboxWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightOrange
  },
  teeboxMainView: {
    ...StyleSheet.absoluteFillObject,
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
  teeboxBodyView: {
    padding: 15,
    paddingTop: 0
  },
  teeboxName: {
    marginTop: 15,
    marginBottom: 30,
    color: offWhite,
    fontSize: 38,
    flexWrap: 'wrap',
    textAlign: 'center'
  },
  editable: {
    backgroundColor: mediumGrey
  },
  detailsWrap: {
    width: '100%',
    alignItems: 'center'
  },
  titleSection: {
    width: '100%',
    marginBottom: 10,
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  title: {
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  details: {
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  ratingSlope: {
    color: offWhite,
    fontSize: 16,
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
