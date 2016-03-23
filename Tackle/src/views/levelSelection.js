import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native'

var GridView = require('react-native-grid-view')
var Form = require('../components/form')

import Game from '../containers/game'

var LEVELS_PER_ROW = 2

class LevelSelection extends Component {

  constructor(props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
    this.onPress = this.onPress.bind(this)
  }

  render() {
    return (
      <GridView
        items={this.props.levelSelection.forms}
        itemsPerRow={LEVELS_PER_ROW}
        renderItem={this.renderItem}
        style={styles.listView}
      />
    )
  }

  renderItem(item) {
    var { SCREEN_WIDTH } = this.props.screenResolution
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
    this.props.navigator.replace({
      title: 'Game',
      component: Game,
      leftButtonTitle: 'Back',
      onLeftButtonPress: () => {
        this.props.resetGame()
        this.props.navigator.pop()
      },
    })
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