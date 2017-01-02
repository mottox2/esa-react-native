import React, { Component } from 'react';

import {
  createRouter,
} from '@exponent/ex-navigation';

import ListScreen from '../screens/ListScreen'
import DetailScreen from '../screens/DetailScreen'
import RootNavigation from '../navigation/RootNavigation'

export default createRouter(() => ({
  list: () => ListScreen,
  detail: () => DetailScreen,
  rootNavigation: () => RootNavigation,
}))
