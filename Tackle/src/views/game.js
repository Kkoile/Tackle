import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native'

var Board = require('../components/board')
import { GameStates, Player } from '../constants/game'
import * as PlayModes from '../constants/playModes'

class Game extends Component {
  constructor(props){
    super(props)
    this.onPressTile = this.onPressTile.bind(this)
    this.onPressStone = this.onPressStone.bind(this)
    this.notifyIfPlayerHasWon = this.notifyIfPlayerHasWon.bind(this)
    this.getInformationAboutOwnColorIfNeeded = this.getInformationAboutOwnColorIfNeeded.bind(this)
  }
  render() {
    var game = this.props.tackleApp.game
    return (
      <View style={styles.container}>
        <Text>Game</Text>
        <Board 
          onPressTile={this.onPressTile}
          onPressStone={this.onPressStone}
          stones={game.stones}
          activePlayer={game.activePlayer}
          gameState={game.gameState}
          screenResolution={this.props.tackleApp.screenResolution}
          selectedStones={game.selectedStones}
          possibleTurns={game.possibleTurns}
        />
        {this.getInformationAboutOwnColorIfNeeded()}
        <Text>Level: {game.level.name}</Text>
        {this.notifyIfPlayerHasWon()}
      </View>
    )
  }
  getInformationAboutOwnColorIfNeeded() {
    if(this.props.tackleApp.game.playMode != PlayModes.LOCALLY) {
      return <Text>Your color: {this.props.tackleApp.game.ownColor}</Text>
    }
  }
  notifyIfPlayerHasWon() {
    var playerHasWon = this.props.tackleApp.game.playerHasWon
    if(playerHasWon) {
      return (
        <View>
          <Text>{playerHasWon} has won</Text>
        </View>
      )
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
})

module.exports = Game