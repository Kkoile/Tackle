import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Board = require('../components/board');
var gameStates = require('../constants/game');

var Game = React.createClass({
  render: function() {
    var game = this.props.game;
    return (
      <View style={styles.container}>
        <Text>Game</Text>
        <Board 
          onPressTile={this.onPressTile}
          onPressStone={this.onPressStone} 
          stones={game.stones}
          activePlayer={game.activePlayer}
          gameState={game.gameState}
        />
      </View>
    );
  },
  onPressTile: function(player, position){
    var gameState = this.props.game.gameState.state;
    if(gameState == gameStates.WHITE_PLAYER_SET_STONE || 
      gameState == gameStates.BLACK_PLAYER_SET_STONE ){
        this.props.onSetStone(player, position);
    }
    if(gameState == gameStates.BLACK_PLAYER_SET_GOLDEN_STONE){
      this.props.onSetGoldenStone(position);
    }
  },
  onPressStone: function(stoneID){
    console.log('stoneID: '+ stoneID);
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