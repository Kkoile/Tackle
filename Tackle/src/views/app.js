import React, {
  Component,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Login = require('./login.js');

var App = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Tackle',
          component: Login,
        }}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

module.exports = App;