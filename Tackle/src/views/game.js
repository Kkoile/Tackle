import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Board = require('../components/board');
var {GameStates, Player} = require('../constants/game');

class Game extends Component {
  constructor(props){
    super(props);
    this.onPressTile = this.onPressTile.bind(this);
    this.onPressStone = this.onPressStone.bind(this);
  }
  render() {
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
          screenResolution={this.props.screenResolution}
        />
      </View>
    );
  }
  onPressTile(player, position) {
    this.props.onSetStone(player, position);
  }
  onPressStone(stoneID){
    console.log('stoneID: '+ stoneID);
  }
}

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
  },
});

module.exports = Game;