import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    axios.post(`${this.props.http}${this.props.api}/api/auth/login`, {
      email: this.state.email,
      password: this.state.password
    }).then( async result => {
      if (result.data.err) {
        this.props.errMsgPopup(result.data.err.msg);
        return;
      }
      const setToken = async token => {
        try {
          await AsyncStorage.setItem('my-golf-tracker-token', token);
        } catch (err) {
          console.log(err);
        }
      };
      await setToken(result.data.token);
      this.props.liftToken(result.data);
      this.props.getUserInfo();
      this.props.changePageFromAuth();
    }).catch( err => console.log(err) );
  }

  render() {
    const { passedStyles } = this.props;
    const { placeholderColor } = this.props;
    return(
      <View style={passedStyles.inputWrap}>

        <Text style={passedStyles.label}>Login</Text>

        <View style={passedStyles.textInputWrap}>
          <TextInput
            placeholder='Email'
            placeholderTextColor={placeholderColor}
            clearButtonMode='while-editing'
            style={passedStyles.textInput}
            value={this.state.email}
            textContentType='emailAddress'
            keyboardType='email-address'
            autoCapitalize='none'
            onChangeText={ email => this.setState({email}) }
          />
        </View>

        <View style={passedStyles.textInputWrap}>
          <TextInput
            placeholder='Password'
            placeholderTextColor={placeholderColor}
            clearButtonMode='while-editing'
            style={passedStyles.textInput}
            value={this.state.password}
            textContentType='password'
            autoCapitalize='none'
            secureTextEntry={true}
            onChangeText={ password => this.setState({password}) }
          />
        </View>

        <TouchableOpacity
          onPress={this.handleSubmit}
          style={passedStyles.button}
        >
          <Text style={passedStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default Login;
