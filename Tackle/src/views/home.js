import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Button = require('react-native-button');

var LevelSelection = require('./levelSelection');

class Home extends Component{
  constructor(props) {
    super(props);
    this.onPressPlay = this.onPressPlay.bind(this);
  }
  render() {
    return (
      <View style={styles.container}>
          <Button 
            style={styles.button}
            onPress={this.onPressPlay}
          >
            Play
          </Button>
      </View>
    );
  }
  onPressPlay() {
    //TODO: Implement logic to play against Someone
    this.props.navigator.push({
      title: 'Level Selection',
      component: LevelSelection,
    }); 
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