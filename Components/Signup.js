import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: ''
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    axios.post('http://localhost:3000/api/auth/signup', {  ////////////// FIX FIX FIX FIX FIX FIX FIX
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }).then( result => {
      AsyncStorage.setItem('golf-budget-tracker-token', result.data.token) // change 'mernToken' to your app name or something useful
      this.props.liftToken(result.data)
    })
  }

  render() {
    return (
      <View>
        <Text>Name:</Text>
        <TextInput
          value={this.state.name}
          autoCapitalize='words'
          onChangeText={ name => this.setState({name}) }
        />

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
        <Button title='Sign Up!' onPress={this.handleSubmit} />
      </View>
    )
  }

}

export default Signup;
