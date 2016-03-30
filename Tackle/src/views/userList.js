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
    var ownUser = this.props.tackleApp.login.userName
    var userButtons = []
    var users = this.props.tackleApp.connection.users
    users.map((user) => {
      if(user !== ownUser) {
        userButtons.push(
          <Button 
            key={user}
            style={styles.button}
            onPress={() => this.onPressedUser(user)}
          >
            {user}
          </Button>
        )
      }
    })
    var attacked
    if(this.props.tackleApp.connection.attacked) {
      attacked =
        <View>
          <Text>You're attacked by {this.props.tackleApp.connection.attacked}</Text>
          <Button 
            style={styles.button}
            onPress={() => this.props.acceptAttack()}
          >
            Accept
          </Button>
          <Button 
            style={styles.button}
            onPress={() => this.props.declineAttack()}
          >
            Decline
          </Button>
        </View>
    }
    return (
      <View style={styles.container}>
        {attacked}
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