import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native'

import * as PlayModes from '../constants/playModes'
import { Player } from '../constants/game'

var GridView = require('react-native-grid-view')
var Form = require('../components/form')

var LEVELS_PER_ROW = 2

class LevelSelection extends Component {

  constructor(props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
    this.onPress = this.onPress.bind(this)
  }

  render() {
    if(this.props.tackleApp.game.playMode === PlayModes.INTERNET
        && this.props.tackleApp.game.ownColor !== Player.WHITE) {
      return (
        <View style={styles.listView}>
          <Text>Please wait till the opponent has chosen a level to play</Text>
        </View> 
      )
    } else {
      return (
        <GridView
          items={this.props.tackleApp.levelSelection.forms}
          itemsPerRow={LEVELS_PER_ROW}
          renderItem={this.renderItem}
          style={styles.listView}
        />
      )   
    }
  }

  renderItem(item) {
    var { SCREEN_WIDTH } = this.props.tackleApp.screenResolution
    return (
      <Form 
        key={item.name} 
        form={item} 
        onPress={this.onPress} 
        width={SCREEN_WIDTH * 0.8 / LEVELS_PER_ROW} 
      />
    )
  }

  onPress(name) {
    this.props.onLevelSelect(name)
  }
}

var styles = StyleSheet.create({
  listView: {
    paddingTop: 64,
    backgroundColor: '#F5FCFF',
    flex: 1
  }
})

module.exports = LevelSelection