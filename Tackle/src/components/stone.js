import React, {
  Component,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

import {Player} from '../constants/game';

class Stone extends Component{
  constructor(props){
    super(props);
    this.onPress = this.onPress.bind(this);
  }
  render() {
    var stone = this.props.stone;

    var style = [
      styles.stone,
      {     
        left: stone.position.col * this.props.screenResolution.TILE_SIZE,
        top: stone.position.row * this.props.screenResolution.TILE_SIZE,
        width: this.props.screenResolution.TILE_SIZE,
        height: this.props.screenResolution.TILE_SIZE,
      }
    ];
    switch (stone.player){
      case Player.WHITE:
        style.push(styles.white);
        break;
      case Player.BLACK:
        style.push(styles.black);
        break;
      case Player.GOLD:
        style.push(styles.gold);
        break;
    }

    return (
        <TouchableHighlight onPress={this.onPress}>
          <View style={style}>
          </View>
        </TouchableHighlight>
    );
  }
  onPress(){
    this.props.onPress(this.props.stone.id);
  }
}

var styles = StyleSheet.create({
  stone: {
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