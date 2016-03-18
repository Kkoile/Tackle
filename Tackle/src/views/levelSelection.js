import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

var GridView = require('react-native-grid-view')
var Form = require('../components/form')

import Game from '../containers/game';

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
        itemsPerRow={2}
        renderItem={this.renderItem}
        style={styles.listView}
      />
    );
  }

  renderItem(item) {
    return <Form key={item.name} form={item} onPress={this.onPress} />
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
    });
  }
}

var styles = StyleSheet.create({
  listView: {
    paddingTop: 64,
    backgroundColor: '#F5FCFF',
    flex: 1
  }
});

module.exports = LevelSelection;