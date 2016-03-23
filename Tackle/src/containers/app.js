'use strict'
import { connect } from 'react-redux'
import { goToHome, goToLogin } from '../actions/navigator'
import App from '../views/app'

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToLogin: (name) => {
      dispatch(goToLogin())
    },
    goToHome: (name, token) => {
      dispatch(goToHome(name, token))
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer