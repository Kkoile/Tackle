'use strict'
import { connect } from 'react-redux'
import { doLogin, getName, getToken } from '../actions/login'
import Login from '../views/login'

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPressLogin: (name) => {
      dispatch(doLogin(name))
    },
    getName: () => {
      dispatch(getName())
    },
    getToken: () => {
      dispatch(getToken())
    }
  }
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default LoginContainer