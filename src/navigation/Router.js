import React, { Component } from 'react';

import {
  Text,
} from 'react-native';

import {
  createRouter,
} from '@exponent/ex-navigation';

import ListScreen from '../screens/ListScreen'
import RootNavigation from '../navigation/RootNavigation'

export default createRouter(() => ({
  home: () => HomeScreen,
  list: () => ListScreen,
  rootNavigation: () => RootNavigation,
}))

class HomeScreen extends Component {
  render() {
    return <Text>HomeScreen</Text>
  }
}
