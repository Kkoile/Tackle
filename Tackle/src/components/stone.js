import React, {
  Component,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

var {width, height} = require('Dimensions').get('window');
var SIZE = 10;
var TILE_SIZE = Math.floor(width * .95 / SIZE);

var Stone = React.createClass({
  render() {
    var stone = this.props.stone;

    var style = [
      styles.stone,
      {     
        left: stone.position.col * TILE_SIZE,
        top: stone.position.row * TILE_SIZE,
      }
    ];
    switch (stone.player){
      case 'WHITE':
        style.push(styles.white);
        break;
      case 'BLACK':
        style.push(styles.black);
        break;
      case 'GOLD':
        style.push(styles.gold);
        break;
    }

    return (
        <TouchableHighlight onPress={this.onPress}>
          <View style={style}>
          </View>
        </TouchableHighlight>
    );
  },
  onPress(){
    this.props.onPress(this.props.stone.id);
  }
});

var styles = StyleSheet.create({
  stone: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    position: 'absolute',
    borderWidth: 1,
  },
  black: {
    backgroundColor: '#000000',
    borderColor: '#000000'
  },
  white: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF'
  },
  gold: {
    backgroundColor: '#C0A201',
    borderColor: '#C0A201'
  }
});

module.exports = Stone;