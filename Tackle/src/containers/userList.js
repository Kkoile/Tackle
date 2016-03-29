'use strict'
import { connect } from 'react-redux'
import UserList from '../views/userList'
import { onUserPressed } from '../actions/connection'

var { Actions } = require('react-native-redux-router')

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
  	onPressedUser: (user) => {
      dispatch(onUserPressed(user))
    },
  }
}

const UserListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList)

export default UserListContainer