import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Button = require('react-native-button')
import LevelSelection from '../containers/levelSelection'
var {Actions} = require('react-native-redux-router')

class Home extends Component {
  constructor(props) {
    super(props)
    this.goToLevelSelection = this.goToLevelSelection.bind(this)
    this.onPressPlayLocally = this.onPressPlayLocally.bind(this)
    this.onPressPlayViaInternet = this.onPressPlayViaInternet.bind(this)
    this.onPressPlayAgainstComputer = this.onPressPlayAgainstComputer.bind(this)
  }

  render() {
    return (
      <View style={styles.container}>
          <Text>Hallo {this.props.tackleApp.login.userName}</Text>
          <Button 
            style={styles.button}
            onPress={this.onPressPlayLocally}
          >
            Play against Friend (Local)
          </Button>
          <Button 
            style={styles.button}
            onPress={this.onPressPlayViaInternet}
          >
            Play against Friend (Internet)
          </Button>
          <Button 
            style={styles.button}
            onPress={this.onPressPlayAgainstComputer}
          >
            Play against Computer
          </Button>
      </View>
    );
  }
  onPressPlayLocally() {
    this.props.playLocally()
    this.goToLevelSelection()
  }
  onPressPlayViaInternet() {
    this.props.playViaInternet()
    this.goToLevelSelection()
  }
  onPressPlayAgainstComputer() {
    this.props.playAgainstComputer()
    this.goToLevelSelection()
  }
  goToLevelSelection() {
    Actions.levelSelection()
  }
}

var styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding:5,
    borderWidth: 2,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
  },
});

module.exports = Home;