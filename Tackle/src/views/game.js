import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Board = require('../components/board');
var GameConstants = require('../constants/game');

var Game = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text>Game</Text>
        <Board/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
  },
});

module.exports = Game;