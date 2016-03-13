import React, {
  Component,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { createStore } from 'redux'
import {Provider} from 'react-redux'
import tackleApp from '../reducers/index'

let store = createStore(tackleApp)

var Login = require('./login.js');

import Game from '../containers/game'

var App = React.createClass({
  render: function() {
    return (
      <Provider store={store}>
        <NavigatorIOS
          style={styles.container}
          initialRoute={{
            title: 'Tackle',
            component: Login,
          }}/>
      </Provider>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

module.exports = App;