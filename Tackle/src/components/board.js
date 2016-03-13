import React, {
  Component,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

import gameStates from '../constants/game';

var Stone = require('./stone');
var Tile = require('./tile');

var {width, height} = require('Dimensions').get('window');
var SIZE = 10;
var TILE_SIZE = Math.floor(width * .95 / SIZE);
var BORDER_WIDTH = 1;

var Board = React.createClass({
  render() {
    //TODO: highligh board if this.props.gameState.state == BLACK_PLAYER_SET_GOLDEN_STONE
    return (
      <View style={styles.container}>
        {this.renderTiles()}
        {this.props.stones.map((stone)=>{
          return (
            <Stone 
              key={stone.id}
              stone={{
                id: stone.id,
                player:stone.player, 
                position:stone.position
              }}
              onPress={this.props.onPressStone}
            />);
        })}
      </View>
    );
  },
  onPressTile(position) {
    this.props.onPressTile(this.props.gameState.activePlayer, position);
  },
  renderTiles() {
    var result = [];
    for (var row = 0; row < SIZE; row++) {
      for (var col = 0; col < SIZE; col++) {
        var key = row * SIZE + col;
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
          />
        );
      }
    }
    /*is needed to represent the court, but it lies over the tiles, so they can't get the touch event
    result.push(
      <View key={'court'} style={styles.court}></View>
    );*/
    return result;
  }
});

var styles = StyleSheet.create({
  container: {
    width: TILE_SIZE * SIZE,
    height: TILE_SIZE * SIZE,
    backgroundColor: 'transparent',
  },
  court: {
    width: TILE_SIZE*SIZE-2*TILE_SIZE+2*BORDER_WIDTH,
    height: TILE_SIZE*SIZE-2*TILE_SIZE+2*BORDER_WIDTH,
    top: TILE_SIZE-BORDER_WIDTH,
    left: TILE_SIZE-BORDER_WIDTH,
    borderWidth: 2*BORDER_WIDTH,
    borderColor: '#30292E',
    backgroundColor: 'transparent',
  },
});

module.exports = Board;