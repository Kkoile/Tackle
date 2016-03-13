import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var {width, height} = require('Dimensions').get('window');
var SIZE = 10;
var TILE_SIZE = Math.floor(width * .95 / SIZE);
var BORDER_WIDTH = 1;

class Board extends Component {
  render() {
    return (
      <View style={styles.container}>
          {this.renderTiles()}
      </View>
    );
  }
  renderTiles() {
    var result = [];
    for (var row = 0; row < SIZE; row++) {
      for (var col = 0; col < SIZE; col++) {
        result.push(this.renderTile(row,col));
      }
    }
    result.push(
      <View key={'court'} style={styles.court}></View>
    );
    return result;
  }
  isCornerTile(row, col){
    if(row==0 && col==0){
      return true;
    }
    if(row==0 && col==SIZE-1){
      return true;
    }
    if(row==SIZE-1 && col==0){
      return true;
    }
    if(row==SIZE-1 && col==SIZE-1){
      return true;
    }
    return false;
  }
  renderTile(row, col) {
    var key = row * SIZE + col;
    var position = {
      left: col * TILE_SIZE,
      top: row * TILE_SIZE
    };
    var tileStyles = [
      styles.tile,
      position
    ];
    if(this.isCornerTile(row,col)){
      tileStyles.push(styles.cornerTile);
    }
    return(
      <View key={key} style={tileStyles}>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: TILE_SIZE * SIZE,
    height: TILE_SIZE * SIZE,
    backgroundColor: 'transparent',
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    justifyContent: 'center',
    borderWidth: BORDER_WIDTH,
    borderColor: '#A7A7A7',
    alignItems: 'center',
    backgroundColor: '#F9F6B2',
  },
  cornerTile: {
    backgroundColor: '#30292E',
    borderColor: '#30292E'
  },
  court: {
    position: 'absolute',
    width: TILE_SIZE*SIZE-2*TILE_SIZE+2*BORDER_WIDTH,
    height: TILE_SIZE*SIZE-2*TILE_SIZE+2*BORDER_WIDTH,
    top: TILE_SIZE-BORDER_WIDTH,
    left: TILE_SIZE-BORDER_WIDTH,
    justifyContent: 'center',
    borderWidth: 2*BORDER_WIDTH,
    borderColor: '#30292E',
  },
});

module.exports = Board;