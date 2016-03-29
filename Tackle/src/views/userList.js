import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native'

var Button = require('react-native-button')

class UserList extends Component {
  constructor(props) {
    super(props)
    this.onPressedUser = this.onPressedUser.bind(this)
  }

  render() {
    var userButtons = []
    var users = this.props.tackleApp.connection.users
    users.map((user) => {
      userButtons.push(
        <Button 
          key={user}
          style={styles.button}
          onPress={() => this.onPressedUser(user)}
        >
          {user}
        </Button>
      )
    })
    return (
      <View style={styles.container}>
        <Text>Available Users: </Text>
        {userButtons}
      </View>
    )
  }
  onPressedUser(user) {
    this.props.onPressedUser(user)
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
})

module.exports = UserList