import React, { Component } from 'react';

import {
  createRouter,
} from '@exponent/ex-navigation';

import ListScreen from '../screens/ListScreen'
import DetailScreen from '../screens/DetailScreen'
import TeamScreen from '../screens/TeamScreen'
import RootNavigation from '../navigation/RootNavigation'

export default createRouter(() => ({
  list: () => ListScreen,
  detail: () => DetailScreen,
  team: () => TeamScreen,
  rootNavigation: () => RootNavigation,
}))
