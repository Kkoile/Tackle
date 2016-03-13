import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Button = require('react-native-button');

import Game from '../containers/game';

var LevelSelection = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
          <Button 
            style={styles.button}
            onPress={this.onPressPlay}
          >
            Play
          </Button>
      </View>
    );
  },
  onPressPlay: function() {
    //TODO: Implement logic to play against Someone
    this.props.navigator.replace({
      title: 'Game',
      component: Game,
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
});

module.exports = LevelSelection;