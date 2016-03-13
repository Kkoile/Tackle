'use strict';
import React, {
  AppRegistry,
  Component,
  NavigatorIOS,
  StyleSheet,
  Text,
  View
} from 'react-native';

var App = require('./src/views/app.js');

class Tackle extends Component {
  render() {
    return <App/>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('Tackle', () => Tackle);
