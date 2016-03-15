import React, {
  Component,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

import gameStates from '../constants/game';

var Stone = require('./stone');
var Tile = require('./tile');

var BORDER_WIDTH = 1;

class Board extends Component {
  constructor(props){
    super(props);
    this.onPressTile = this.onPressTile.bind(this);
  }
  render() {
    //TODO: highligh board if this.props.gameState.state == BLACK_PLAYER_SET_GOLDEN_STONE
    return (
      <View 
        style={[
          styles.container, 
          {
            width: this.props.screenResolution.TILE_SIZE * this.props.screenResolution.SIZE,
            height: this.props.screenResolution.TILE_SIZE * this.props.screenResolution.SIZE
          }
        ]}
      >
        {this.renderTiles()}
        {this.props.stones.map((stone)=>{
          var index = this.props.selectedStones.indexOf(stone)
          return (
            <Stone 
              key={stone.id}
              stone={{
                id: stone.id,
                player:stone.player, 
                position:stone.position
              }}
              screenResolution={this.props.screenResolution}
              onPress={this.props.onPressStone}
              isSelected={index>-1}
            />);
        })}
      </View>
    );
  }
  onPressTile(position) {
    this.props.onPressTile(this.props.gameState.activePlayer, position);
  }
  renderTiles() {
    var result = [];
    for (var row = 0; row < this.props.screenResolution.SIZE; row++) {
      for (var col = 0; col < this.props.screenResolution.SIZE; col++) {
        var key = row * this.props.screenResolution.SIZE + col
        var possibleTurnRows = this.props.possibleTurns[col]
        var isPossibleTurn = false
        if(possibleTurnRows){
          isPossibleTurn = possibleTurnRows[row]
        }
        result.push(
          <Tile 
            key={key} 
            position={
              {
                row: row, 
                col:col
              }
            } 
            id={key} 
            row={row} 
            col={col} 
            onPress={this.onPressTile}
            screenResolution={this.props.screenResolution}
            isPossibleTurn={isPossibleTurn}
          />
        );
      }
    }
    return result;
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  court: {
    borderWidth: 2*BORDER_WIDTH,
    borderColor: '#30292E',
    backgroundColor: 'transparent',
  },
});

module.exports = Board;