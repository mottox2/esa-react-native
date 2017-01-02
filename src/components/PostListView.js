import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
} from 'react-native';

import {
  NavigationProvider,
  createRouter,
  StackNavigation,
} from '@exponent/ex-navigation';

import ListScreen from '../screens/ListScreen.js'
import RootNavigation from '../navigation/RootNavigation.js'

import Router from '../navigation/Router.js'

export default class PostListView extends Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation initialRoute={Router.getRoute('rootNavigation')} />
      </NavigationProvider>
    )
  }
}
