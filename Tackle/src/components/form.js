import React, {
  Component,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native';

var BORDER_WIDTH = 1;
var TILE_SIZE = 50;

class Form extends Component {

  constructor(props) {
    super(props)
    this.onPress = this.onPress.bind(this)
  }

  render() {
    var form = this.props.form;
    
    return (<TouchableHighlight underlayColor={'rgba(220,220,220,0.5)'}key={form.name} onPress={this.onPress} style={[styles.containerView, {
        height: form.tiles.length*TILE_SIZE, 
        width: form.tiles[0].length*TILE_SIZE
      }]}>
      <View>
      {form.tiles.map(function(tile, i) {
        return <View style={styles.innerView}>
        {tile.map(function(tileEntry, j) {
          var position = {
            left: j*TILE_SIZE, 
            top: i*TILE_SIZE
          }

          var tileStyles = [
            styles.tile,
            {
              backgroundColor: tileEntry == 0 ? 'transparent' : '#F9F6B2',
              borderWidth: tileEntry
            },
            position
          ]
          var key = form.name+'-'+i+'-'+j
          return <View key={key} style={tileStyles} />
        })}
        </View>

      })}
      </View>
      </TouchableHighlight>
    )
  }

  onPress() {
    this.props.onPress(this.props.form.name)
  }
}

var styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderColor: '#A7A7A7'
  },
  containerView: {
    flex: 1,
    marginTop: 15
  },
  innerView: {
    flexDirection: 'row'
  }
});

module.exports = Form;