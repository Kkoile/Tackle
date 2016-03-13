import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

var Button = require('react-native-button');

var Home = require('./home');

var Login = React.createClass({
  getInitialState: function() {
    return(
      {
        name: '',
      }
    );
  },
  render: function() {
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
      </View>
    );
  },
  onPressLogin: function() {
    //TODO: Implement login 
    this.props.navigator.replace({
      title: 'Home',
      component: Home,
    });
  }
});

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