import React, {
  Component,
  NavigatorIOS,
  StyleSheet,
} from 'react-native';

import { createStore, applyMiddleware, compose } from 'redux'
import {Provider} from 'react-redux'
import tackleApp from '../reducers/index'
import thunkMiddleware from 'redux-thunk'

const finalCreateStore = compose(
  applyMiddleware(thunkMiddleware)
)(createStore)

let store = finalCreateStore(tackleApp)

import Login from '../containers/login'

class App extends Component{
  render() {
    return (
      <Provider store={store}>
        <NavigatorIOS
          style={styles.container}
          initialRoute={{
            title: 'Tackle',
            component: Login,
          }}/>
      </Provider>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

module.exports = App;
