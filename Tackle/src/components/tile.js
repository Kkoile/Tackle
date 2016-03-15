import React, {
  Component,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

var BORDER_WIDTH = 1;

class Tile extends Component {
  constructor(props){
    super(props);
    this.onPress = this.onPress.bind(this);
  }
  render() {
    var {row, col} = this.props;
    var key = row * this.props.screenResolution.SIZE + col;
    var position = {
      left: col * this.props.screenResolution.TILE_SIZE,
      top: row * this.props.screenResolution.TILE_SIZE
    };
    var tileStyles = [
      styles.tile,
      position,
      {
        width: this.props.screenResolution.TILE_SIZE,
        height: this.props.screenResolution.TILE_SIZE
      }
    ];
    if(this.props.isPossibleTurn){
      tileStyles.push({backgroundColor:'green'})
    }
    if(this.isCornerTile(row,col)){
      tileStyles.push(styles.cornerTile);
    }
    return(
      <TouchableHighlight key={key} onPress={this.onPress}>
        <View style={tileStyles}>
        </View>
      </TouchableHighlight>
    );
  }
  isCornerTile(row, col){
    if(row==0 && col==0){
      return true;
    }
    if(row==0 && col==this.props.screenResolution.SIZE-1){
      return true;
    }
    if(row==this.props.screenResolution.SIZE-1 && col==0){
      return true;
    }
    if(row==this.props.screenResolution.SIZE-1 && col==this.props.screenResolution.SIZE-1){
      return true;
    }
    return false;
  }
  onPress(){
    this.props.onPress(this.props.position);
  }
}

var styles = StyleSheet.create({
  tile: {
    position: 'absolute',
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