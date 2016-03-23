import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

var Button = require('react-native-button')

import Home from '../containers/home'
import { States } from '../constants/login'
import { Actions } from 'react-native-redux-router'

class Login extends Component{
  constructor(props){
    super(props)
    this.onPressLogin = this.onPressLogin.bind(this)
    this.informThatUserNameIsAlreadyTakenIfNeeded = this.informThatUserNameIsAlreadyTakenIfNeeded.bind(this)
    this.state = {name: ''}
    props.getName()
    props.getToken()
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formular}>
          <Text>Name:</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
          />
        </View>
        <Button style={styles.button} onPress={this.onPressLogin}>
          Login
        </Button>
        {this.informThatUserNameIsAlreadyTakenIfNeeded()}
      </View>
    )
  }
  informThatUserNameIsAlreadyTakenIfNeeded() {
    if(this.props.tackleApp.login.state == States.USER_NAME_ALREADY_TAKEN) {
      return (
        <Text>Username is already taken</Text>
      )
    }
  }
  onPressLogin() {
    this.props.onPressLogin(this.state.name)
  }
}

var styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding:5,
    borderWidth: 2,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
  },
  formular: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  inputField: {
    marginLeft: 20,
    padding: 5,
    borderWidth: 2,
    width: 200,
    height: 40,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
});

module.exports = Login;