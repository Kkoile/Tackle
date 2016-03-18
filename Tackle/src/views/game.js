import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Board = require('../components/board')
var {GameStates, Player} = require('../constants/game')
import * as PlayModes from '../constants/playModes'

class Game extends Component {
  constructor(props){
    super(props);
    this.onPressTile = this.onPressTile.bind(this)
    this.onPressStone = this.onPressStone.bind(this)
    this.getInformationAboutOwnColorIfNeeded = this.getInformationAboutOwnColorIfNeeded.bind(this)
  }
  render() {
    var game = this.props.game
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
          selectedStones={game.selectedStones}
          possibleTurns={game.possibleTurns}
        />
        {this.getInformationAboutOwnColorIfNeeded()}
      </View>
    );
  }
  getInformationAboutOwnColorIfNeeded() {
    if(this.props.game.playMode != PlayModes.LOCALLY) {
      return <Text>Your color: {this.props.game.ownColor}</Text>
    }
  }
  onPressTile(player, position) {
    this.props.onClickField(player, position)
  }
  onPressStone(stoneID){
    this.props.onClickStone(stoneID)
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