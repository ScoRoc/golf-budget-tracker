import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View, Button } from 'react-native';
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
    e.preventDefault()
    axios.post('http://localhost:3000/api/auth/login', {  ////////////// FIX FIX FIX FIX FIX FIX FIX
      email: this.state.email,
      password: this.state.password
    }).then( result => {
      AsyncStorage.setItem('golf-budget-tracker-token', result.data.token) // change 'mernToken' to your app name or something useful
      this.props.liftToken(result.data)
    }).catch( err => console.log(err) )
  }

  render() {
    return(
      <View>
        <Text>Email:</Text>
        <TextInput
          value={this.state.email}
          textContentType='emailAddress'
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={ email => this.setState({email}) }
        />

        <Text>Password:</Text>
        <TextInput
          value={this.state.password}
          textContentType='password'
          autoCapitalize='none'
          onChangeText={ password => this.setState({password}) }
        />
        <Button title='Log In!' onPress={this.handleSubmit} />
      </View>
    )
  }

}

export default Login;
