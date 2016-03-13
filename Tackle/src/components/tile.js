import React, {
  Component,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

var {width, height} = require('Dimensions').get('window');
var SIZE = 10;
var TILE_SIZE = Math.floor(width * .95 / SIZE);
var BORDER_WIDTH = 1;

var Tile = React.createClass({
  render() {
    var {row, col} = this.props;
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
      <TouchableHighlight key={key} onPress={this.onPress}>
        <View style={tileStyles}>
        </View>
      </TouchableHighlight>
    );
  },
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
  },
  onPress(){
    this.props.onPress(this.props.position);
  }
});

var styles = StyleSheet.create({
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
    backgroundColor: '#4F444C',
    borderColor: '#4F444C'
  },
});

module.exports = Tile;