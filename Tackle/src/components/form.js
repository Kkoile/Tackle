import React, {
  Component,
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native'

class Form extends Component {

  constructor(props) {
    super(props)
    this.onPress = this.onPress.bind(this)
    var form = props.form;
    var longestSide = form.tiles.length
    if(form.tiles[0].length>longestSide) {
      longestSide = form.tiles[0].length
    }
    this.TILE_SIZE = props.width / longestSide * 0.9
  }

  render() {
    var form = this.props.form;
    var TILE_SIZE = this.TILE_SIZE
    var figureWidth = form.tiles[0].length * TILE_SIZE
    var figureHeight = form.tiles.length * TILE_SIZE
    var startPositionLeft = this.props.width / 2 - figureWidth / 2
    var startPositionTop = this.props.width / 2 - figureHeight / 2

    return (
      <TouchableHighlight 
        underlayColor={'rgba(220,220,220,0.5)'}
        key={form.name} 
        onPress={this.onPress} 
        style={[
          styles.containerView, 
          {
            height: this.props.width, 
            width: this.props.width
          }
        ]}
      >
      <View>
      {form.tiles.map(function(tile, i) {
        return(
          <View 
            key={form.name+'-'+i}
            style={styles.innerView}
          >
          {tile.map(function(tileEntry, j) {
            var position = {
              left: j*TILE_SIZE + startPositionLeft, 
              top: i*TILE_SIZE + startPositionTop
            }

            var backgroundColor = 'transparent'
            if(tileEntry == 1) {
              backgroundColor = '#F9F6B2'
            }
            if(tileEntry == 2) {
              backgroundColor = '#50E8F9'
            }

            var tileStyles = [
              styles.tile,
              {
                backgroundColor: backgroundColor,
                borderWidth: tileEntry == 0 ? 0 : 1,
                width: TILE_SIZE,
                height: TILE_SIZE,
              },
              position
            ]
            var key = form.name+'-'+i+'-'+j
            return <View key={key} style={tileStyles} />
          })}
        </View>
        )
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
    borderColor: '#A7A7A7'
  },
  containerView: {
    marginTop: 15
  },
  innerView: {
    flexDirection: 'row'
  }
});

module.exports = Form;